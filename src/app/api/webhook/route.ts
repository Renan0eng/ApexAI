import AiConfig from "@/app/(main)/(admin)/whats-config/page";
import { AIConfig, generateAiResponse } from "@/lib/ai/chat";
import prisma from "@/lib/db";
import { verifyWebhook } from "@/lib/webhook/verify";
import { getProdutoByGrupOrName } from "@/model/produto";
import { endSession, initClient } from "@/model/session";
import { createCliente, createVenda, findCliente } from "@/model/venda";
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

  const NewMessage = [
    {
      _data: {
        id: [Object],
        viewed: false,
        body: ".",
        type: "chat",
        t: 1729453218,
        notifyName: "Cristina B. Guimarães",
        from: [Object],
        to: [Object],
        ack: 1,
        invis: false,
        isNewMsg: true,
        star: false,
        kicNotified: false,
        recvFresh: true,
        isFromTemplate: false,
        pollInvalidated: false,
        isSentCagPollCreation: false,
        latestEditMsgKey: null,
        latestEditSenderTimestampMs: null,
        mentionedJidList: [],
        groupMentions: [],
        isEventCanceled: false,
        eventInvalidated: false,
        isVcardOverMmsDocument: false,
        isForwarded: false,
        hasReaction: false,
        viewMode: "VISIBLE",
        messageSecret: [Object],
        productHeaderImageRejected: false,
        lastPlaybackProgress: 0,
        isDynamicReplyButtonsMsg: false,
        isCarouselCard: false,
        parentMsgId: null,
        isMdHistoryMsg: false,
        stickerSentTs: 0,
        isAvatar: false,
        lastUpdateFromServerTs: 0,
        invokedBotWid: null,
        bizBotType: null,
        botResponseTargetId: null,
        botPluginType: null,
        botPluginReferenceIndex: null,
        botPluginSearchProvider: null,
        botPluginSearchUrl: null,
        botPluginSearchQuery: null,
        botPluginMaybeParent: false,
        botReelPluginThumbnailCdnUrl: null,
        botMsgBodyType: null,
        requiresDirectConnection: false,
        bizContentPlaceholderType: null,
        hostedBizEncStateMismatch: false,
        senderOrRecipientAccountTypeHosted: false,
        placeholderCreatedWhenAccountIsHosted: false,
        links: [],
      },
      id: {
        fromMe: false,
        remote: "554491024020@c.us",
        id: "21F0A84388BDCE58183AB45F8C86D049",
        _serialized: "false_554491024020@c.us_21F0A84388BDCE58183AB45F8C86D049",
      },
      ack: 1,
      hasMedia: false,
      body: ".",
      type: "chat",
      timestamp: 1729453218,
      from: "554491024020@c.us",
      to: "554491571020@c.us",
      deviceType: "android",
      isForwarded: false,
      forwardingScore: 0,
      isStatus: false,
      isStarred: false,
      fromMe: false,
      hasQuotedMsg: false,
      hasReaction: false,
      vCards: [],
      mentionedIds: [],
      groupMentions: [],
      isGif: false,
      links: [],
    },
  ];

  type NewMessageType = typeof NewMessage & Message[];

  switch (body.type) {
    case "message":
      const messages = body.messages as NewMessageType;

      if (
        messages === null ||
        messages[messages.length - 1]._data.notifyName !==
          "Cristina B. Guimarães"
      ) {
        console.log("No developer user");

        return NextResponse.json("No developer user");
      }

      console.log("message", messages);

      const whatsappConfig = await prisma.whatsappClient.findUnique({
        where: {
          id: body.clientId,
        },
        include: {
          ai_config: {
            include: {
              produtos: {
                include: {
                  group: true,
                },
              },
            },
          },
        },
      });

      if (!whatsappConfig || !whatsappConfig.active) {
        console.log("Client not active");
        return NextResponse.json("Client not active");
      } else if (!whatsappConfig.ai_config) {
        console.log("Client not configured");
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
          " este é o horaro atual. priorize informações chave, economize tokens, envie emojis. Não responda perguntas fora do escopo comercial da empresa, não invente nenhuma informação.",
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
          console.log("get_current_weather");

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

          console.log(
            "get_products",
            generatedResponse.choices[0].message.function_call?.arguments
          );

          const { grupo, produto } = JSON.parse(
            generatedResponse.choices[0].message.function_call?.arguments
          );

          const produtos = await getProdutoByGrupOrName(
            whatsappConfig.ai_config,
            grupo,
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
            message:
              formatForWhatsApp(newResponse.choices[0].message.content) +
              `Tokens: ${newResponse.usage?.total_tokens}`,
            clientId: body.clientId,
          });
        } else if (
          // função para pegar os produtos
          generatedResponse.choices[0].message.function_call?.name ===
          "buy_products"
        ) {
          console.log(
            "buy_product",
            generatedResponse.choices[0].message.function_call?.arguments
          );

          const { produto, quantidade, email, cpf, endereco, confirma } =
            JSON.parse(
              generatedResponse.choices[0].message.function_call?.arguments
            );

          const produtos = await getProdutoByGrupOrName(
            whatsappConfig.ai_config,
            produto
          );

          if (typeof produtos === "string") {
            chat.push({
              content: "Produto não encontrado",
              role: "function",
              name: "buy_product",
            });

            const newResponse = await generateAiResponse(
              chat,
              whatsappConfig.ai_config
            );

            await axios.post("http://localhost:8000/whatsapp/message", {
              conversationId: messages[0].id.remote,
              message:
                formatForWhatsApp(newResponse.choices[0].message.content) +
                `Tokens: ${newResponse.usage?.total_tokens}`,
              clientId: body.clientId,
            });

            return NextResponse.json("Message received");
          }

          console.log("produtos", produtos);

          const name = messages[messages.length - 1]._data.notifyName;

          const phone = messages[messages.length - 1].from;

          console.log("produtos", produtos);
          console.log("name", name);
          console.log("email", email);
          console.log("phone", phone);
          console.log("cpf", cpf);
          console.log("endereco", endereco);
          console.log("quantidade", quantidade);
          console.log("confirma", confirma);

          let cliente = await findCliente(phone);

          console.log("cliente", cliente);

          console.log((!name || !phone || !cpf || !endereco) && !cliente);

          if ((!name || !phone || !cpf || !endereco) && !cliente) {
            if (!name) {
              chat.push({
                content: "Informe o nome do cliente",
                role: "function",
                name: "buy_product",
              });
            }

            if (!phone) {
              chat.push({
                content: "Informe o telefone do cliente",
                role: "function",
                name: "buy_product",
              });
            }

            if (!cpf) {
              chat.push({
                content: "Informe o CPF do cliente",
                role: "function",
                name: "buy_product",
              });
            }

            if (!endereco) {
              chat.push({
                content: "Informe o endereço do cliente",
                role: "function",
                name: "buy_product",
              });
            }

            const newResponse = await generateAiResponse(
              chat,
              whatsappConfig.ai_config
            );

            await axios.post("http://localhost:8000/whatsapp/message", {
              conversationId: messages[0].id.remote,
              message:
                formatForWhatsApp(newResponse.choices[0].message.content) +
                `Tokens: ${newResponse.usage?.total_tokens}`,
              clientId: body.clientId,
            });

            return NextResponse.json("Message received");
          }

          if (!cliente) {
            cliente = await createCliente({
              name,
              email,
              phone,
              cpf,
              endereco,
              ai_config_id: whatsappConfig.ai_config.id,
            });
          }

          if (!cliente) {
            chat.push({
              content: "Erro ao criar cliente",
              role: "function",
              name: "buy_product",
            });

            const newResponse = await generateAiResponse(
              chat,
              whatsappConfig.ai_config
            );

            await axios.post("http://localhost:8000/whatsapp/message", {
              conversationId: messages[0].id.remote,
              message:
                formatForWhatsApp(newResponse.choices[0].message.content) +
                `Tokens: ${newResponse.usage?.total_tokens}`,
              clientId: body.clientId,
            });

            return NextResponse.json("Message received");
          }

          chat.push({
            content: "Cliente criado com sucesso",
            role: "function",
            name: "buy_product",
          });

          if (!quantidade || quantidade < 1) {
            chat.push({
              content: "Informe a quantidade de produtos",
              role: "function",
              name: "buy_product",
            });

            const newResponse = await generateAiResponse(
              chat,
              whatsappConfig.ai_config
            );

            await axios.post("http://localhost:8000/whatsapp/message", {
              conversationId: messages[0].id.remote,
              message:
                formatForWhatsApp(newResponse.choices[0].message.content) +
                `Tokens: ${newResponse.usage?.total_tokens}`,
              clientId: body.clientId,
            });

            return NextResponse.json("Message received");
          }

          if (!confirma) {
            chat.push({
              content:
                "Pergunte se deve cinfirmar a compra de " +
                quantidade +
                " " +
                produto +
                "?",
              role: "function",
              name: "buy_product",
            });

            const newResponse = await generateAiResponse(
              chat,
              whatsappConfig.ai_config
            );

            await axios.post("http://localhost:8000/whatsapp/message", {
              conversationId: messages[0].id.remote,
              message:
                formatForWhatsApp(newResponse.choices[0].message.content) +
                `Tokens: ${newResponse.usage?.total_tokens}`,
              clientId: body.clientId,
            });

            return NextResponse.json("Message received");
          }

          const venda = await createVenda({
            produtos: produtos.map((produto) => ({
              id: produto.id,
              quantidade: quantidade,
            })),
            cliente_id: cliente.id,
            quantidade: quantidade,
            valor: produtos.reduce(
              (acc, cur) => acc + cur.price * quantidade,
              0
            ),
            ai_config_id: whatsappConfig.ai_config.id,
          });

          if (!venda) {
            chat.push({
              content: "Erro ao criar venda",
              role: "function",
              name: "buy_product",
            });

            const newResponse = await generateAiResponse(
              chat,
              whatsappConfig.ai_config
            );

            await axios.post("http://localhost:8000/whatsapp/message", {
              conversationId: messages[0].id.remote,
              message:
                formatForWhatsApp(newResponse.choices[0].message.content) +
                `Tokens: ${newResponse.usage?.total_tokens}`,
              clientId: body.clientId,
            });

            return NextResponse.json("Message received");
          }

          chat.push({
            content: `Fornessa os dados ao cliente, código da venda: ${
              venda.id
            }, Produto: ${venda.produtos
              .map((produto) => produto.name)
              .join(", ")}, Cliente: ${venda.cliente_id}, Quantidade: ${
              venda.quantidade
            }, Valor: ${venda.valor}`,
            role: "function",
            name: "buy_product",
          });

          const newResponse = await generateAiResponse(
            chat,
            whatsappConfig.ai_config
          );

          // console.log("newResponse", newResponse.choices[0].message.content);

          await axios.post("http://localhost:8000/whatsapp/message", {
            conversationId: messages[0].id.remote,
            message:
              formatForWhatsApp(newResponse.choices[0].message.content) +
              `Tokens: ${newResponse.usage?.total_tokens}`,
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
