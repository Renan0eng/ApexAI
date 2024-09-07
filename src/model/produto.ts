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
  if (!group && !name) {
    ret = await prisma.produto.findMany({
      where: {
        ai_config_id: aiConfig.id,
      },
    });
    if (ret.length) return ret;

    return `Pergunte ao cliente qual o grupo ou nome do produto que ele deseja, estes são os nossos grupos de produtos: ${(
      await prisma.group.findMany({
        where: {
          produto: {
            some: {
              ai_config_id: aiConfig.id,
            },
          },
        },
      })
    )
      .map((item) => item.name)
      .join(", ")}`;
  }
  if (!group) {
    console.log("name", name);
    ret = await prisma.produto.findMany({
      where: {
        OR: editName?.map((item) => ({
          name: {
            contains: `${item}`,
          },
        })),
        ai_config_id: aiConfig.id,
      },
    });
    if (ret.length) return ret;

    return `Não encontramos nenhum produto para vc estes são os nossos grupos de produtos: ${(
      await prisma.group.findMany({
        where: {
          produto: {
            some: {
              ai_config_id: aiConfig.id,
            },
          },
        },
      })
    )
      .map((item) => item.name)
      .join(", ")}`;
  }
  if (!name) {
    console.log("editGroup", editGroup);
    ret = await prisma.produto.findMany({
      where: {
        group: {
          some: {
            OR: editGroup?.map((item) => ({
              name: {
                contains: `${item}`,
              },
            })),
          },
        },
        ai_config_id: aiConfig.id,
      },
    });
    if (ret.length) return ret;

    return `Não encontramos nenhum produto para vc estes são os nossos grupos de produtos: ${(
      await prisma.group.findMany({
        where: {
          produto: {
            some: {
              ai_config_id: aiConfig.id,
            },
          },
        },
      })
    )
      .map((item) => item.name)
      .join(", ")}`;
  }
  ret = await prisma.produto.findMany({
    where: {
      OR: [
        {
          group: {
            some: {
              name: {
                in: editGroup,
              },
            },
          },
        },
        {
          name: {
            contains: `_${name}_`,
          },
        },
      ],
      ai_config_id: aiConfig.id,
    },
  });

  if (ret.length) return ret;

  return `Não encontramos nenhum produto para vc estes são os nossos grupos de produtos: ${(
    await prisma.group.findMany({
      where: {
        produto: {
          some: {
            ai_config_id: aiConfig.id,
          },
        },
      },
    })
  )
    .map((item) => item.name)
    .join(", ")}`;
}
