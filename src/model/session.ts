import prisma from "@/lib/db";
import { AIConfig, Client } from "@prisma/client";
import type { Message } from "whatsapp-web.js";

export async function initClient(messages: Message[], aiConfig: AIConfig) {
  const { from } = messages[0];
  const data = await prisma.client.findUnique({
    where: {
      phone: from,
    },
    include: {
      session_whatsapp: true,
    },
  });

  if (!data) {
    const data = await prisma.client.create({
      data: {
        phone: from,
      },
    });
    if (data) initSession(messages, data, aiConfig);
    return;
  }

  if (data.session_whatsapp.filter((item) => item.end === null).length == 0) {
    initSession(messages, data, aiConfig);
    return;
  }
}

export async function initSession(
  messages: Message[],
  data: Client,
  aiConfig: AIConfig
) {
  const session = await prisma.session_whatsapp.create({
    data: {
      client_id: data.id,
      ia_config_id: aiConfig.id,
    },
  });

  return session;
}

export async function endSession(messages: Message[], nota: string) {
  const client = await prisma.client.findUnique({
    where: {
      phone: messages[0].from,
    },
    include: {
      session_whatsapp: true,
    },
  });

  console.log("client", client);

  const session = await prisma.session_whatsapp.update({
    where: {
      id: client?.session_whatsapp.filter((item) => item.end === null)[0].id,
    },
    data: {
      end: new Date(),
    },
  });

  return session;
}
