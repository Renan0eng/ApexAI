import prisma from "@/lib/db";
import { Client, Produto, Venda } from "@prisma/client";

type PropsCreateVenda = {
  produtos: { id: number; quantidade: number }[];
  cliente_id: string;
  quantidade: number;
  ai_config_id: string | null;
};

// cria uma venda
export async function createVenda(venda: PropsCreateVenda) {
  const produtos = await Promise.all(
    venda.produtos.map(async ({ id, quantidade }) => {
      const produto = await prisma.produto.findFirst({
        where: {
          id: id,
        },
      });

      // Retorna o produto com a quantidade ou apenas o produto, dependendo da necessidade
      return { ...produto, quantidade }; // Incluindo a quantidade se necessário
    })
  );

  const ret = await prisma.venda.create({
    data: {
      cliente_id: venda.cliente_id,
      quantidade: venda.quantidade,
      valor: produtos.reduce(
        (acc, cur) => acc + (cur.price || 0) * cur.quantidade,
        0
      ),
      ai_config_id: venda.ai_config_id,
      produtos: {
        create: venda.produtos.map((produto) => ({
          produto_id: produto.id,
          quantidade: produto.quantidade,
          valor: produtos.reduce(
            (acc, cur) => acc + (cur.price || 0) * produto.quantidade,
            0
          ),
        })),
      },
    },
    include: {
      produtos: {
        include: {
          produto: true,
        },
      },
    },
  });

  return ret;
}

type PropsCreateCliente = {
  name: string;
  email: string | null;
  phone: string;
  cpf: string;
  endereco: string;
  ai_config_id: string;
};

// Cria um cliente
export async function createCliente(cliente: PropsCreateCliente) {
  const ret = await prisma.cliente.create({
    data: {
      ...cliente,
    },
  });

  return ret;
}

// Busca um cliente pelo telefone
export async function findCliente(phone: string) {
  const ret = await prisma.cliente.findFirst({
    where: {
      phone,
    },
  });

  return ret;
}
