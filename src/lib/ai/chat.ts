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

  // Usando if-else para a lógica de AiConfig

  if (AiConfig.type.includes("V")) {
    console.log("Venda");

    // Valida se o grupo não é repetido
    const groups = [] as { id: number; name: string }[];
    if (AiConfig.produtos?.length) {
      AiConfig.produtos?.forEach((produto) => {
        produto.group?.forEach((group) => {
          const find = groups.find((g) => g.name === group.name);
          if (!find) {
            groups.push(group);
          }
        });
      });
    } else {
      console.error("AiConfig.produtos está indefinido ou vazio.");
    }

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
              produto: {
                type: "string",
                description:
                  "Produto ou serviço, e.g." +
                  AiConfig.produtos
                    ?.slice(0, 4)
                    .map((produto) => produto.name)
                    .join(", "),
              },
              grupo: {
                type: "string",
                description:
                  "Grupo de produtos ou serviços, e.g." +
                  groups
                    ?.slice(0, 10)
                    .map((group) => group.name)
                    .join(", "),
              },
            },
            required: ["produto"],
          },
        },
        {
          name: "get_purchase",
          description: "buscas as compras ou o carrinho do cliente",
          parameters: {
            type: "object",
            properties: {
              cpf: {
                type: "string",
                description:
                  "CPF do cliente, e.g. 123.456.789-00, neste formato",
              },
            },
            required: ["cpf"],
          },
        },
        {
          name: "delete_purchase",
          description: "Deleta ou remove a compra baseado no id da compra",
          parameters: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: `Id da compra, e.g. 12ed53a8-ff7b-48ca-93f3-92ccf0ed7c27, 2e3d53a8-ff7b-48ca-93f3-92ccf0ed7c27`,
              },
              cpf: {
                type: "string",
                description: "CPF do cliente, e.g. 123.456.789-00",
              },
            },
            required: ["id", "cpf"],
          },
        },
        {
          name: "confirm_purchase",
          description:
            "Confirmação de compra ou cancela a compra do cliente geral ou pelo id",
          parameters: {
            type: "object",
            properties: {
              confirm: {
                type: "boolean",
                description:
                  "Confirmação ou cancelamento de compra, e.g. true ou false",
              },
              id: {
                type: "string",
                description: `Id da compra, e.g. 12ed53a8-ff7b-48ca-93f3-92ccf0ed7c27, 2e3d53a8-ff7b-48ca-93f3-92ccf0ed7c27`,
              },
              cpf: {
                type: "string",
                description:
                  "CPF do cliente obrigatorio para confirmar a compra, e.g. 123.456.789-00",
              },
            },
            required: ["confirm", "cpf"],
          },
        },
        {
          name: "buy_products",
          description:
            "compra de produtos e criação do cliente pergunte a quantidade, Não crie parametros que não existem, ao fim pergunte se deseja confirmar a compra",
          parameters: {
            type: "object",
            properties: {
              produto: {
                type: "string",
                description:
                  "Pergunta se o cliente deseja comprar mais produtos quando o produto é escolhido. Produtos:" +
                  AiConfig.produtos
                    ?.slice(0, 4)
                    .map((produto) => produto.name)
                    .join(", "),
              },
              quantidade: {
                type: "number",
                description:
                  "Quantidade, e.g. 1, 2, 3, não esqueça de perguntar a quantidade",
              },
              cpf: {
                type: "string",
                description:
                  "CPF do cliente se não precisar não pergunte sobre o cpf, e.g. 123.456.789-00",
              },
              endereco: {
                type: "string",
                description:
                  "Endereço do cliente não precisar não pergunte sobre o endereço, e.g. Rua 1, 123",
              },
            },
            required: ["produto"],
          },
        },
      ],
      function_call: "auto",
    });
    return venda;
  } else {
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
