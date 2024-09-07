import { getServerSideSession } from "@/lib/session";
import {
  PropsCreateAiConfig,
  createAiConfig,
  deleteAiConfig,
  getAiConfigs,
  saveFiles,
  updateAiConfig,
} from "@/model/ai-config";
import { NextRequest, NextResponse } from "next/server";

type PropsForm = {
  id?: string;
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
  faq:
    | {
        id: string;
        quest: string;
        response: string | File;
      }[]
    | string;
  files: {
    name: string;
    url: string;
  }[];
  action?: string;
};

export const POST = async (request: NextRequest) => {
  const form = (await request.formData()) as FormData;

  const data = JSON.parse(form.get("data") as string) as PropsForm | null;

  const user = await getServerSideSession();

  if (!user.user) return NextResponse.json({ ret: "not found" });

  if (data?.action === "delete" && data.id) {
    const ret = await deleteAiConfig(data.id.toString());
    return NextResponse.json({ ret });
  }

  const filesFaq = form.getAll("fileFaq") as File[];

  console.log("filesFaq", filesFaq);

  // recebe um array de files
  const files = form.getAll("file") as File[];

  const faqFiles = await saveFiles(filesFaq, "faq=");

  console.log("faqFiles", faqFiles);

  if (!data) {
    return NextResponse.json({}, { status: 400 });
  }

  data.faq =
    typeof data?.faq !== "string"
      ? data?.faq
          .map((item) => {
            if (faqFiles.find((file) => file.name === item.response)) {
              const file = faqFiles.find((file) => file.name === item.response);
              console.log("file", file);
              item.response = file?.url || "";
            }
            return `${item.quest}: ${item.response}`;
          })
          .join("\n")
          .trim()
      : data?.faq;

  data.files = await saveFiles(files);
  data.files = [...faqFiles, ...data.files];
  data.user_id = user.user.userId;

  console.log("data", data);

  if (data?.action === "update" && data?.id) {
    delete data?.action;
    const ret = await updateAiConfig(data?.id, {
      ...data,
      faq: data?.faq,
    } as PropsCreateAiConfig);
    return NextResponse.json({ ret });
  }

  const ret = await createAiConfig({
    ...data,
    faq: data?.faq,
  } as PropsCreateAiConfig);

  return NextResponse.json({ ret });
};

export const GET = async (request: NextRequest) => {
  const user = await getServerSideSession();

  if (!user.user) return NextResponse.json({ ret: "not found" });

  const ret = await getAiConfigs(user.user.userId, "G");

  return NextResponse.json(ret);
};
