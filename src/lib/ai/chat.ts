import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { openai } from "./config";
import { Prisma } from "@prisma/client";

export type AIConfig = Prisma.AIConfigGetPayload<{
  include: {
    produtos: {
      include: {
        group: true;
      };
    };
  };
}>;

export async function generateAiResponse(
  messages: ChatCompletionMessageParam[],
  AiConfig: AIConfig
) {
  console.log("messages", messages);
  // console.log("AiConfig", AiConfig);

  // switch type of AiConfig to use the correct model

  switch (AiConfig.type) {
    case "help":
      const chatHelp = await openai.chat.completions.create({
        messages,
        model: AiConfig.model,
        max_tokens: AiConfig.max_tokens,
        functions: [
          {
            name: "get_products",
            description: "pega os produtos ",
            parameters: {
              type: "object",
              properties: {
                // area: {
                //   type: "string",
                //   description:
                //     "Area de atuação, e.g. Vendas, Suporte e Restaurantes",
                // },
                produto: {
                  type: "string",
                  description: "Produtos, e.g. ",
                },
              },
            },
          },
        ],
        function_call: "auto",
      });
      return chatHelp;
    case "V":
      // console.log("AiConfig.produtos", AiConfig.produtos);

      // valida se o grupo não é se repete
      const groups = [] as { id: number; name: string }[];
      AiConfig.produtos.forEach((produto) => {
        produto.group.forEach((group) => {
          const find = groups.find((g) => g.name === group.name);
          if (!find) {
            groups.push(group);
          }
        });
      });

      // console.log("groups", groups);

      const venda = await openai.chat.completions.create({
        messages,
        model: AiConfig.model,
        max_tokens: AiConfig.max_tokens,
        functions: [
          {
            name: "get_products",
            description: "pega os produtos ou serviços",
            parameters: {
              type: "object",
              properties: {
                // area: {
                //   type: "string",
                //   description:
                //     "Area de atuação, e.g. Vendas, Suporte e Restaurantes",
                // },
                produto: {
                  type: "string",
                  description:
                    "Produto ou serviço, e.g." +
                    AiConfig.produtos
                      .slice(0, 4)
                      .map((produto) => produto.name)
                      .join(", "),
                },
                grupo: {
                  type: "string",
                  description:
                    "Grupo de produtos ou serviços, e.g." +
                    groups
                      .slice(0, 10)
                      .map((group) => group.name)
                      .join(", "),
                },
              },
              required: ["produto"],
            },
          },
          {
            name: "buy_products",
            description:
              "compra de produtos e criação do cliente pergunte a quantidade, Não crie parametros que não existem",
            parameters: {
              type: "object",
              properties: {
                produto: {
                  type: "string",
                  description:
                    "Produto ou serviço, e.g. " +
                    AiConfig.produtos
                      .slice(0, 4)
                      .map((produto) => produto.name)
                      .join(", ") +
                    ", pergunta se o cliente deseja comprar mais produtos quando o produto é escolhido",
                },
                quantidade: {
                  type: "number",
                  description:
                    "Quantidade, e.g. 1, 2, 3, não esqueça de pergunta a quantidade",
                },
                cpf: {
                  type: "string",
                  description: "CPF do cliente, e.g. 123.456.789-00",
                },
                endereco: {
                  type: "string",
                  description: "Endereço do cliente, e.g. Rua 1, 123",
                },
                confirma: {
                  type: "boolean",
                  description:
                    "Pergunata antes de fechar a venda apos a escolha do produto",
                },
              },
              required: ["produto", "quantidade"],
            },
          },
        ],
        function_call: "auto",
      });
      return venda;
    default:
      const completition = await openai.chat.completions.create({
        messages,
        model: AiConfig.model,
        max_tokens: AiConfig.max_tokens,
        functions: [
          {
            name: "get_current_weather",
            description: "A function to get the current weather",
            parameters: {
              type: "object",
              properties: {
                state: {
                  type: "string",
                  description: "State, e.g. San Francisco, CA",
                },
                city: {
                  type: "string",
                  description: "City, e.g. San Francisco",
                },
                unit: {
                  type: "string",
                  enum: ["celsius", "fahrenheit"],
                },
              },
              required: ["state", "city"],
            },
          },
        ],
        function_call: "auto",
      });
      return completition;
  }
}
