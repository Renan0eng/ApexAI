import prisma from "@/lib/db";
import { Client, Venda } from "@prisma/client";

type PropsCreateVenda = {
  produtos: { id: number; quantidade: number }[];
  cliente_id: string;
  quantidade: number;
  valor: number;
  ai_config_id: string | null;
};

// cria uma venda
export async function createVenda(venda: PropsCreateVenda) {
  const ret = await prisma.venda.create({
    data: {
      cliente_id: venda.cliente_id,
      quantidade: venda.quantidade,
      valor: venda.valor,
      ai_config_id: venda.ai_config_id,
      produtos: {
        connect: venda.produtos.map((item) => ({
          id: item.id, // Assumindo que 'id' é o identificador do produto
        })),
      },
    },
    include: {
      produtos: true,
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
