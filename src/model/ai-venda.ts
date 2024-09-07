import prisma from "@/lib/db";
import { AIConfig } from "@prisma/client";
import path from "path";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export type PropsCreateAiVenda = {
  user_id: string;
  name: string;
  sistema: string;
  max_tokens: number;
  model: string;
  temperature: number;
  stop: string;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  faq: string;
  files: {
    name: string;
    url: string;
  }[];
  produto: {
    name: string;
    price: number;
    description: string;
    link: string;
    group: string[];
  }[];
  type: string;
};

export async function createAiVenda(
  data: PropsCreateAiVenda
): Promise<AIConfig> {
  const ret = await prisma.aIConfig.create({
    data: {
      user_id: data.user_id,
      name: data.name,
      sistema: data.sistema,
      max_tokens: data.max_tokens,
      model: data.model,
      temperature: data.temperature,
      stop: data.stop,
      top_p: data.top_p,
      frequency_penalty: data.frequency_penalty,
      presence_penalty: data.presence_penalty,
      faq: data.faq,
      type: data.type,
      files: {
        create: data.files.map((file) => ({
          name: file.name,
          url: file.url,
        })),
      },
    },
  });

  data.produto.map(async (item) => {
    await prisma.produto.create({
      data: {
        name: item.name,
        link: item.link,
        price: item.price,
        description: item.description,
        user_id: data.user_id,
        ai_config_id: ret.id,
        group: {
          connectOrCreate: item.group.map((item) => ({
            where: { name: item },
            create: { name: item },
          })),
        },
      },
    });
  });

  return ret;
}

export function getAiVendas(
  id: string,
  type: string
): Promise<AIConfig[] | null> {
  return prisma.aIConfig.findMany({
    where: {
      user_id: id,
      sistema: type,
    },
  });
}

export function getAiVenda(id: string): Promise<AIConfig | null> {
  return prisma.aIConfig.findUnique({
    where: {
      id,
      type: "V",
    },
  });
}

export function deleteAiVenda(id: string): Promise<AIConfig | null> {
  return prisma.aIConfig.delete({
    where: {
      id,
    },
  });
}

export async function updateAiVenda(
  id: string,
  data: PropsCreateAiVenda
): Promise<AIConfig | null> {
  const ret = await prisma.aIConfig.update({
    where: {
      id,
    },
    data: {
      user_id: data.user_id,
      name: data.name,
      sistema: data.sistema,
      max_tokens: data.max_tokens,
      model: data.model,
      temperature: data.temperature,
      stop: data.stop,
      top_p: data.top_p,
      frequency_penalty: data.frequency_penalty,
      presence_penalty: data.presence_penalty,
      faq: data.faq,
      type: data.type,
      files: {
        create: data.files,
      },
    },
  });

  await prisma.produto.deleteMany({
    where: {
      ai_config_id: ret.id,
    },
  });

  data.produto.map(async (item) => {
    await prisma.produto.create({
      data: {
        name: item.name,
        link: item.link,
        price: item.price,
        description: item.description,
        user_id: data.user_id,
        ai_config_id: ret.id,
        group: {
          connectOrCreate: item.group.map((item) => ({
            where: { name: item },
            create: { name: item },
          })),
        },
      },
    });
  });

  return ret;
}

export async function getAiVendaById(id: string): Promise<AIConfig | null> {
  const ret = await prisma.aIConfig.findUnique({
    where: {
      id,
    },
    include: {
      files: true,
    },
  });

  return ret;
}

export async function saveFiles(files: File[], id?: string) {
  const ret = [] as { name: string; url: string }[];

  await Promise.all(
    files.map(async (file) => {
      const name = `${uuidv4()}.${file.type.split("/")[1]}`;

      const destinationDirPath = path.join(process.cwd(), "public/files");

      const fileArrayBuffer = await file.arrayBuffer();

      if (!existsSync(destinationDirPath)) {
        await mkdir(destinationDirPath, { recursive: true });
      }

      await writeFile(
        path.join(destinationDirPath, name),
        Buffer.from(fileArrayBuffer)
      );

      ret.push({
        name: `${id ? id : ""}${file.name}`,
        url: `files/${name}`,
      });
    })
  );

  return ret;
}
