import { NextRequest, NextResponse } from "next/server";

import { getServerSideSession } from "@/lib/session";

import { openai } from "@/lib/ai/config";
import puppeteer from "puppeteer";
import cheerio from "cheerio";

export async function POST(req: NextRequest) {
  const user = await getServerSideSession();

  if (!user.user) return NextResponse.json({ ret: "not found" });

  const body = await req.json();
  const site = body.site;

  if (!site) {
    return NextResponse.json(
      { message: "Campo vazio" },
      {
        status: 401,
      }
    );
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  let response;

  try {
    response = await page.goto(site);
  } catch (error) {
    console.error("Erro ao acessar o site:", error);
    return NextResponse.json(
      { message: "Erro ao acessar o site" },
      {
        status: 500,
      }
    );
  }

  let pageContent = await page.content();
  // console.log(pageContent)

  // console.log(response);
  // await page.screenshot({ path: "example.png" });

  // Salva a descrição que vai estar na tag do <meta> com o parâmetro name="description"
  const descriptionContent = await page.evaluate(() => {
    const metaDescriptionTag = document.querySelector(
      'meta[name="description"]'
    );
    return metaDescriptionTag ? metaDescriptionTag.getAttribute("content") : "";
  });

  // Salva o conteúdo da tag <title>
  const titleMatch = pageContent.match(/<title>(.*?)<\/title>/);
  const pageTitle = titleMatch ? titleMatch[1] : "";

  // Remove o conteúdo dos scripts novamente, pois Cheerio não lida com scripts
  const pageContentWithoutScripts = pageContent.replace(
    /<script\b[^>]*>.*?<\/script>/gs,
    ""
  );

  const $ = cheerio.load(pageContentWithoutScripts);
  const textContent = $("body").text();

  // console.log(textContent);

  await browser.close();

  // Vai resumir o conteúdo do site
  const resumo = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Sabendo que o título do site é " +
          pageTitle +
          " e a descrição que está na tag do <meta> é " +
          descriptionContent +
          ", procure essas informações 'Qual o nome da empresa', 'Quais são os principais produtos ou serviços oferecidos pela empresa?', 'Horário de atendimento?', 'Como entrar em contato com a empresa?' e 'Endereço da empresa?' com o web scrap que eu fiz. Darei um exemplo para que todas as respostas sigam esse formato, Qual o nome da empresa?: resposta Quais são os principais produtos ou serviços oferecidos pela empresa?: resposta. Quebre a linha para separará-las. Caso não consiga achar a resposta para a pergunta, a resposta deve ser 'Não encontrado' " +
          textContent,
      },
    ],
    max_tokens: 2000,
  });

  // console.log(resumo.choices[0].message.content);

  return NextResponse.json(
    {
      message: resumo.choices[0].message.content,
    },
    { status: 200 }
  );
}
