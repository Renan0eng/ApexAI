import { getAiConfigById } from "@/model/ai-config";
import AiVendaEditView from "@/sections/ai-venda/edit/ai-venda-edit-view";

export default async function page({ params: { id }, }: { params: { id: string; }; }) {

  const aiConfig = await getAiConfigById(id) as any;

  return (
    <AiVendaEditView aiConfig={aiConfig} />
  )
}