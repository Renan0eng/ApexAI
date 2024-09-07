import { generateAiResponse } from "@/lib/ai/chat";
import { getProdutoByGrupOrName } from "@/model/produto";
import { AIConfig } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

type Messages = {
  date: string;
  body: string;
  type: string;
}[];

const sendMessage = async (
  messages: Messages,
  ai_config: AIConfig | null
): Promise<string | null | { error: string }> => {
  if (messages === null || messages.length === 0) {
    return { error: "No messages" };
  }

  if (ai_config === null) {
    return { error: "No AI config" };
  }

  const chat: ChatCompletionMessageParam[] = messages.map((message) => ({
    content: message.body,
    role: message.type ? "assistant" : "user",
  }));

  chat.unshift({
    content:
      "Você é um atendente virtual, aqui estão os dados da empresa que você vai atender os clientes " +
      ai_config.sistema +
      ".\n\n" +
      new Date().toLocaleTimeString() +
      " este é o horaro atual. priorize informações chave, economize tokens, envie emojis. Não responda perguntas fora do escopo comercial da empresa.",
    role: "system",
  });

  const generatedResponse = await generateAiResponse(chat, ai_config);

  console.log(
    "generatedResponse",
    generatedResponse.choices[0].message.content
  );

  if (
    // função para pegar os produtos
    generatedResponse.choices[0].message.function_call?.name === "get_products"
  ) {
    const { area, produto } = JSON.parse(
      generatedResponse.choices[0].message.function_call?.arguments
    );

    const produtos = await getProdutoByGrupOrName(ai_config, area, produto);

    chat.push({
      content: JSON.stringify(produtos),
      role: "function",
      name: "get_products",
    });

    const newResponse = await generateAiResponse(chat, ai_config);

    return newResponse.choices[0].message.content;
  }

  return generatedResponse.choices[0].message.content;
};

export async function POST(req: NextRequest) {
  const { messages, ai_config } = await req.json();

  console.log("messages", messages);

  const message = await sendMessage(messages, ai_config);

  console.log("message", message);

  if (message instanceof Object && "error" in message) {
    return NextResponse.json({ error: message.error });
  }

  return NextResponse.json({ message: message });
}
