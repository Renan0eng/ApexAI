import { getServerSideSession } from "@/lib/session";
import { getAiConfigs } from "@/model/ai-config";
import AiConfigView from "@/sections/ai-config-view";
import { AIConfig } from "@prisma/client";

export default async function page() {

  const user = await getServerSideSession();

  const AiConfigs = await getAiConfigs(user.user.userId, 'G') as AIConfig[];

  return (
    <AiConfigView AiConfigs={AiConfigs} />
  )
}