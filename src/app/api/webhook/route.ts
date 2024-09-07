import AiConfig from "@/app/(main)/(admin)/whats-config/page";
import { generateAiResponse } from "@/lib/ai/chat";
import prisma from "@/lib/db";
import { verifyWebhook } from "@/lib/webhook/verify";
import { getProdutoByGrupOrName } from "@/model/produto";
import { endSession, initClient } from "@/model/session";
import { Produto } from "@prisma/client";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import type { Message } from "whatsapp-web.js";

export async function POST(req: NextRequest) {
  function formatForWhatsApp(text: string | null) {
    if (!text) return null;

    // Negrito: **texto** para *texto*
    text = text.replace(/\*\*(.*?)\*\*/g, "*$1*");

    // Itálico: *texto* para _texto_
    text = text.replace(/\*(.*?)\*/g, "_$1_");

    // Tachado: ~texto~ para ~texto~
    text = text.replace(/~(.*?)~/g, "~$1~");

    // Links: [texto](link) para link
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, "$2");

    return text;
  }

  const { valid, body } = await verifyWebhook(req);

  if (!valid) {
    return NextResponse.json("Invalid signature", { status: 200 });
  }

  switch (body.type) {
    case "message":
      const messages = body.messages as Message[];

      console.log("messages", messages);

      const whatsappConfig = await prisma.whatsappClient.findUnique({
        where: {
          id: body.clientId,
        },
        include: {
          ai_config: true,
        },
      });

      if (!whatsappConfig || !whatsappConfig.active) {
        return NextResponse.json("Client not active");
      } else if (!whatsappConfig.ai_config) {
        return NextResponse.json("Client not configured");
      }

      const chat: ChatCompletionMessageParam[] = messages.map((message) => ({
        content: message.body,
        role: message.fromMe ? "assistant" : "user",
      }));

      chat.unshift({
        content:
          "Você é um atendente virtual, aqui estão os dados da empresa que você vai atender os clientes " +
          whatsappConfig.ai_config.sistema +
          ".\n\n" +
          new Date().toLocaleTimeString() +
          " este é o horaro atual. priorize informações chave, economize tokens, envie emojis. Não responda perguntas fora do escopo comercial da empresa",
        role: "system",
      });

      initClient(messages, whatsappConfig.ai_config);

      const generatedResponse = await generateAiResponse(
        chat,
        whatsappConfig.ai_config
      );

      if (generatedResponse.choices[0].finish_reason === "function_call") {
        if (
          generatedResponse.choices[0].message.function_call?.name ===
          "get_current_weather"
        ) {
          const body = JSON.parse(
            generatedResponse.choices[0].message.function_call?.arguments
          );

          const res = await axios.get(
            `https://api.hgbrasil.com/weather?key=6b49adc2&city_name=${body.city},${body.state}`
          );

          chat.push({
            content: JSON.stringify(res.data.results),
            role: "function",
            name: "get_current_weather",
          });

          const newResponse = await generateAiResponse(
            chat,
            whatsappConfig.ai_config
          );

          await axios.post("http://localhost:8000/whatsapp/message", {
            conversationId: messages[0].id.remote,
            message: formatForWhatsApp(newResponse.choices[0].message.content),
            clientId: body.clientId,
          });
        } else if (
          // função para pegar os produtos
          generatedResponse.choices[0].message.function_call?.name ===
          "get_products"
        ) {
          // console.log("body", body);

          // console.log(
          //   "arguments",
          //   generatedResponse.choices[0].message.function_call?.arguments
          // );

          const { area, produto } = JSON.parse(
            generatedResponse.choices[0].message.function_call?.arguments
          );

          const produtos = await getProdutoByGrupOrName(
            whatsappConfig.ai_config,
            area,
            produto
          );

          chat.push({
            content: JSON.stringify(produtos),
            role: "function",
            name: "get_products",
          });

          const newResponse = await generateAiResponse(
            chat,
            whatsappConfig.ai_config
          );

          // console.log("newResponse", newResponse.choices[0].message.content);



          await axios.post("http://localhost:8000/whatsapp/message", {
            conversationId: messages[0].id.remote,
            message: formatForWhatsApp(newResponse.choices[0].message.content) + `Tokens: ${newResponse.usage?.total_tokens}`,
            clientId: body.clientId,
          });
        } else if (
          // função encerra o chat
          generatedResponse.choices[0].message.function_call?.name ===
          "end_chat"
        ) {
          const { nota, end_chat } = JSON.parse(
            generatedResponse.choices[0].message.function_call?.arguments
          );

          console.log("Finaliza chat", nota, end_chat);

          if (!nota && !end_chat) {
            chat.push({
              content: "Nota não informada? qual nota vc daria?",
              role: "function",
              name: "end_chat",
            });
          }

          if (!nota) {
            chat.push({
              content: "Nota não informada",
              role: "function",
              name: "end_chat",
            });
          }

          if (!end_chat) {
            chat.push({
              content: "Deseja finalizar o chat?",
              role: "function",
              name: "end_chat",
            });
          }

          endSession(messages, nota);

          chat.push({
            content:
              "Chat finalizado com sucesso, responda: obrigado pela preferência",
            role: "function",
            name: "end_chat",
          });

          const newResponse = await generateAiResponse(
            chat,
            whatsappConfig.ai_config
          );

          console.log("newResponse", newResponse.choices[0].message.content);

          await axios.post("http://localhost:8000/whatsapp/message", {
            conversationId: messages[0].id.remote,
            message: formatForWhatsApp(newResponse.choices[0].message.content),
            clientId: body.clientId,
          });
        }
      } else {
        await axios.post("http://localhost:8000/whatsapp/message", {
          conversationId: messages[0].id.remote,
          message: formatForWhatsApp(
            generatedResponse.choices[0].message.content
          ),
          clientId: body.clientId,
        });
      }

      return NextResponse.json("Message received");
    case "qrcode":
      await prisma.whatsappClient.update({
        data: {
          qrCode: body.qrCode,
          ready: false,
        },
        where: {
          id: body.clientId,
        },
      });

      return NextResponse.json("Qrcode received");
    case "ready":
      await prisma.whatsappClient.update({
        data: {
          ready: true,
        },
        where: {
          id: body.clientId,
        },
      });

      return NextResponse.json("Client ready");
    case "disconnected":
      await prisma.whatsappClient.update({
        data: {
          ready: false,
        },
        where: {
          id: body.clientId,
        },
      });

      return NextResponse.json("Client disconnected");
  }
}
