import { AIConfig, generateAiResponse } from "@/lib/ai/chat";
import prisma from "@/lib/db";
import { getServerSideSession } from "@/lib/session";
import { getProdutoByGrupOrName } from "@/model/produto";
import { createCliente, createVenda, findCliente } from "@/model/venda";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

type Venda = Prisma.VendaGetPayload<{
  include: {
    produtos: {
      include: {
        produto: true;
      };
    };
  };
}>;

type Messages = {
  date: string;
  body: string;
  type: string;
  // notifyName: string;
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
    content: message.body || "",
    role: message.type == "assistant" ? "assistant" : "user",
  }));

  chat.unshift({
    content:
      "Você é um atendente virtual, aqui estão os dados da empresa que você vai atender os clientes " +
      ai_config.sistema +
      ".\n\n" +
      ai_config.faq +
      new Date().toLocaleTimeString() +
      " este é o horario atual. priorize informações chave, economize tokens, envie emojis. Não responda perguntas fora do escopo comercial da empresa.",
    role: "system",
  });

  const generatedResponse = await generateAiResponse(chat, ai_config);

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
      name: generatedResponse.choices[0].message.function_call?.name,
    });

    const newResponse = await generateAiResponse(chat, ai_config);

    return newResponse.choices[0].message.content;
  }
  if (
    // função para confirmar a compra
    generatedResponse.choices[0].message.function_call?.name === "get_purchase"
  ) {
    let { cpf } = JSON.parse(
      generatedResponse.choices[0].message.function_call?.arguments
    );

    // Remove todos os caracteres não numéricos do CPF
    cpf = cpf.replace(/\D/g, "");

    const vendas = await prisma.venda.findMany({
      where: {
        cliente: {
          cpf: cpf,
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

    chat.push({
      content: `Vendas: ${vendas
        ?.map(
          (compra: Venda) =>
            `
          ===============================================
          Id${compra.id} - Produtos: ${compra.produtos
              ?.map(
                (produtoVenda) =>
                  `
                Nome: ${produtoVenda.produto.name}, 
                Quantidade: ${produtoVenda.quantidade}, 
                Valor: ${produtoVenda.produto.price} 
                Comfirmado: ${compra.confirmado}`
              )
              .join(", ")}`
        )
        .join(", ")} 
        Valor total: ${vendas.reduce(
          (acc, cur) =>
            acc +
            cur.produtos.reduce(
              (acc, cur) => acc + cur.produto.price * cur.quantidade,
              0
            ),
          0
        )}
        mostre o id da compra para deletar ou confirmar`,
      role: "function",
      name: generatedResponse.choices[0].message.function_call?.name,
    });

    const newResponse = await generateAiResponse(chat, ai_config);

    console.log("newResponse", newResponse.choices[0].message.content);

    return newResponse.choices[0].message.content;
  }
  if (
    // função para deletar a compra
    generatedResponse.choices[0].message.function_call?.name ===
    "delete_purchase"
  ) {
    let { id, cpf } = JSON.parse(
      generatedResponse.choices[0].message.function_call?.arguments
    );

    // Remove todos os caracteres não numéricos do CPF
    cpf = cpf.replace(/\D/g, "");

    console.log("id", id);
    console.log("cpf", cpf);

    // deleta os produtos da venda
    const deleteProdutosResponse = await prisma.produto_Venda.deleteMany({
      where: {
        venda_id: id,
        venda: {
          cliente: {
            cpf: cpf,
          },
        },
      },
    });

    console.log("deleteProdutosResponse", deleteProdutosResponse);

    // Tenta deletar a venda correspondente ao ID e CPF fornecidos
    const deleteResponse = await prisma.venda.deleteMany({
      where: {
        id: id, // Verifique se o ID está correto (aqui assumimos que o ID é uma string)
        cliente: {
          cpf: cpf,
        },
      },
    });

    console.log("deleteResponse", deleteResponse);

    // Checa se alguma venda foi deletada
    if (deleteResponse.count > 0) {
      chat.push({
        content: `Compra com ID: ${id} foi deletada com sucesso.`,
        role: "function",
        name: generatedResponse.choices[0].message.function_call?.name,
      });
    } else {
      chat.push({
        content: `Nenhuma compra encontrada para o ID: ${id} e CPF: ${cpf}.`,
        role: "function",
        name: generatedResponse.choices[0].message.function_call?.name,
      });
    }

    const newResponse = await generateAiResponse(chat, ai_config);
    console.log("newResponse", newResponse.choices[0].message.content);

    return newResponse.choices[0].message.content;
  }
  if (
    // função para confirmar a compra
    generatedResponse.choices[0].message.function_call?.name ===
    "confirm_purchase"
  ) {
    let { confirm, cpf, id } = JSON.parse(
      generatedResponse.choices[0].message.function_call?.arguments
    );

    // Remove todos os caracteres não numéricos do CPF
    cpf = cpf.replace(/\D/g, "");

    if (id) {
      await prisma.venda.updateMany({
        where: {
          id: id,
          cliente: {
            cpf: cpf,
          },
        },
        data: {
          confirmado: confirm,
        },
      });
    } else {
      await prisma.venda.updateMany({
        where: {
          cliente: {
            cpf: cpf,
          },
        },
        data: {
          confirmado: confirm,
        },
      });
    }

    // Agora, busque as vendas atualizadas
    const vendasAtualizadas = await prisma.venda.findMany({
      where: {
        cliente: {
          cpf: cpf,
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

    console.log(vendasAtualizadas);

    if (!vendasAtualizadas) {
      chat.push({
        content: "Erro ao confirmar a compra",
        role: "function",
        name: generatedResponse.choices[0].message.function_call?.name,
      });

      const newResponse = await generateAiResponse(chat, ai_config);

      return newResponse.choices[0].message.content;
    }

    chat.push({
      content: `Compra confirmada: ${vendasAtualizadas
        ?.map(
          (compra: Venda) =>
            `${compra.id} - ${compra.produtos
              ?.map(
                (produtoVenda) =>
                  `${produtoVenda.produto.name} - ${produtoVenda.quantidade} - ${produtoVenda.produto.price}`
              )
              .join(", ")}`
        )
        .join(", ")}`,
      role: "function",
      name: generatedResponse.choices[0].message.function_call?.name,
    });

    const newResponse = await generateAiResponse(chat, ai_config);

    return newResponse.choices[0].message.content;
  }
  if (
    // função para comprar
    generatedResponse.choices[0].message.function_call?.name === "buy_products"
  ) {
    console.log(
      "buy_products",
      generatedResponse.choices[0].message.function_call?.arguments
    );

    let { produto, quantidade, email, cpf, endereco, confirma } = JSON.parse(
      generatedResponse.choices[0].message.function_call?.arguments
    );

    // Remove todos os caracteres não numéricos do CPF
    if (cpf) cpf = cpf.replace(/\D/g, "");

    console.log("produto", produto);

    const produtos = await getProdutoByGrupOrName(ai_config, produto);

    if (typeof produtos === "string") {
      chat.push({
        content: "Produto não encontrado",
        role: "function",
        name: generatedResponse.choices[0].message.function_call?.name,
      });

      const newResponse = await generateAiResponse(chat, ai_config);

      return newResponse.choices[0].message.content;
    }

    console.log("produtos", produtos);

    const user = await getServerSideSession();

    console.log("user: ", user);

    const name = "Renan";

    const phone = "44991571020";

    console.log("produtos", produtos);
    console.log("name", name);
    console.log("email", email);
    console.log("phone", phone);
    console.log("cpf", cpf);
    console.log("endereco", endereco);
    console.log("quantidade", quantidade);
    console.log("confirma", confirma);

    let cliente = await findCliente(phone);

    if (cliente) {
      chat.push({
        content:
          "Cliente ja cadastrado com esse telefone não a de endereco e cpf",
        role: "system",
      });
    }

    console.log("cliente", cliente);

    console.log((!name || !phone || !cpf || !endereco) && !cliente);

    if ((!name || !phone || !cpf || !endereco) && !cliente) {
      chat.push({
        content: `Informe o${!name ? " nome" : ""}${!phone ? " telefone" : ""}${
          !cpf ? " CPF" : ""
        }${!endereco ? " endereço" : ""} do cliente`,
        role: "function",
        name: generatedResponse.choices[0].message.function_call?.name,
      });

      const newResponse = await generateAiResponse(chat, ai_config);

      console.log("newResponse", newResponse.choices);
      console.log("newResponse", newResponse.choices[0]);
      console.log("newResponse", newResponse.choices[0].message.content);

      return newResponse.choices[0].message.content;
    }

    if (!cliente) {
      cliente = await createCliente({
        name,
        email,
        phone,
        cpf,
        endereco,
        ai_config_id: ai_config.id,
      });
    }

    if (!cliente) {
      chat.push({
        content: "Erro ao criar cliente",
        role: "function",
        name: generatedResponse.choices[0].message.function_call?.name,
      });

      const newResponse = await generateAiResponse(chat, ai_config);

      return newResponse.choices[0].message.content;
    }

    chat.push({
      content: "Cliente criado com sucesso",
      role: "function",
      name: generatedResponse.choices[0].message.function_call?.name,
    });

    if (!quantidade || quantidade < 1) {
      chat.push({
        content: "Informe a quantidade de produtos",
        role: "function",
        name: generatedResponse.choices[0].message.function_call?.name,
      });

      const newResponse = await generateAiResponse(chat, ai_config);

      console.log("newResponse", newResponse);

      return newResponse.choices[0].message.content;
    }

    const venda = await createVenda({
      produtos: produtos.map((produto) => ({
        id: produto.id,
        quantidade: quantidade,
      })),
      cliente_id: cliente.id,
      quantidade: quantidade,
      ai_config_id: ai_config.id,
    });

    if (!venda) {
      chat.push({
        content: "Erro ao criar venda",
        role: "function",
        name: generatedResponse.choices[0].message.function_call?.name,
      });

      const newResponse = await generateAiResponse(chat, ai_config);

      console.log("newResponse", newResponse);

      return newResponse.choices[0].message.content;
    }

    chat.push({
      content: `Fornessa os dados ao cliente, código da venda: ${
        venda.id
      }, Produto: ${venda.produtos
        .map((produtoVenda) => produtoVenda.produto.name)
        .join(", ")}, Cliente: ${venda.cliente_id}, Quantidade: ${
        venda.quantidade
      }, Valor: ${venda.valor}`,
      role: "function",
      name: generatedResponse.choices[0].message.function_call?.name,
    });

    const newResponse = await generateAiResponse(chat, ai_config);

    console.log("newResponse", newResponse);

    return newResponse.choices[0].message.content;
  }

  return generatedResponse.choices[0].message.content;
};

export async function POST(req: NextRequest) {
  const { messages, ai_config } = await req.json();

  // console.log("messages", messages);

  const message = await sendMessage(messages, ai_config);

  // console.log("message", message);

  if (message instanceof Object && "error" in message) {
    return NextResponse.json({ error: message.error });
  }

  return NextResponse.json({ message: message });
}
