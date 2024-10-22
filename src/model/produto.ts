import prisma from "@/lib/db";
import { AIConfig, Produto } from "@prisma/client";

type PropsCreateProduto = {
  name: string;
  link: string;
  price: number;
  group: { name: string }[];
  description: string;
  user_id: string;
};

export function createManyProdutos(produtos: PropsCreateProduto[]) {
  const ret = produtos.map(async (item) => {
    return await prisma.produto.create({
      data: {
        name: item.name,
        link: item.link,
        price: item.price,
        description: item.description,
        user_id: item.user_id,
        group: {
          connectOrCreate: item.group.map((item) => ({
            where: { name: item.name },
            create: { name: item.name },
          })),
        },
      },
    });
  });
  return ret;
}

export async function getProdutoByGrupOrName(
  aiConfig: AIConfig,
  group?: string,
  name?: string
) {
  let ret = [];
  const editGroup = group?.split(" ");
  const editName = name?.split(" ");

  // Consulta sem filtros específicos
  if (!group && !name) {
    ret = await prisma.produto.findMany({
      where: { ai_config_id: aiConfig.id },
    });
    if (ret.length) return ret;

    const grupos = await prisma.group.findMany({
      where: {
        produto: { some: { ai_config_id: aiConfig.id } },
      },
      select: { name: true },
    });

    return `Pergunte ao cliente qual o grupo ou nome do produto que ele deseja. Estes são os nossos grupos de produtos: ${grupos
      .map((item) => item.name)
      .join(", ")}`;
  }

  // Busca por nome
  if (!group) {
    ret = await prisma.produto.findMany({
      where: {
        OR: editName?.map((item) => ({
          name: { contains: item }, // Busca case-insensitive no nome
        })),
        ai_config_id: aiConfig.id,
      },
    });
    if (ret.length) return ret;

    return `Nenhum produto encontrado. Aqui estão os nossos grupos de produtos: ${await listarGrupos(
      aiConfig
    )}`;
  }

  // Busca por grupo
  if (!name) {
    ret = await prisma.produto.findMany({
      where: {
        group: {
          some: {
            OR: editGroup?.map((item) => ({
              name: { contains: item }, // Sem o uso de `mode` aqui, já que estamos filtrando grupos
            })),
          },
        },
        ai_config_id: aiConfig.id,
      },
    });
    if (ret.length) return ret;

    return `Nenhum produto encontrado no grupo. Aqui estão os nossos grupos de produtos: ${await listarGrupos(
      aiConfig
    )}`;
  }

  // Busca combinada por grupo e nome
  ret = await prisma.produto.findMany({
    where: {
      OR: [
        {
          group: {
            some: {
              name: { in: editGroup }, // Busca por nome de grupo
            },
          },
        },
        {
          name: { contains: name }, // Busca por nome do produto case-insensitive
        },
      ],
      ai_config_id: aiConfig.id,
    },
  });

  if (ret.length) return ret;

  return `Nenhum produto encontrado para esse nome ou grupo. Estes são os nossos grupos de produtos: ${await listarGrupos(
    aiConfig
  )}`;
}

// Função auxiliar para listar os grupos
async function listarGrupos(aiConfig: AIConfig) {
  const grupos = await prisma.group.findMany({
    where: {
      produto: { some: { ai_config_id: aiConfig.id } },
    },
    select: { name: true },
  });
  return grupos.map((item) => item.name).join(", ");
}
