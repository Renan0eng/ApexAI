import { getServerSideSession } from "@/lib/session";
import { getAiConfigs } from "@/model/ai-config";
import AiVendaView from "@/sections/ai-venda/ai-venda-view";
import { AIConfig, Produto } from "@prisma/client";

export type AiVendas = {
  id: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  name: string;
  sistema: string;
  faq: string;
  max_tokens: number;
  model: string;
  temperature: number;
  stop: string;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  type: string;
  produtos: Produto[];
}

export default async function page() {

  const user = await getServerSideSession();

  const AiConfigs = await getAiConfigs(user.user.userId, "V") as AiVendas[];

  return (
    <AiVendaView AiConfigs={AiConfigs} />
  )
}