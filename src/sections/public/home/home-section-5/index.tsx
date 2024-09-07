import { LuBuilding2 } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import Precos from "./preco-desconto";

export default function HomeSection5() {
  return (
    <div className="md:p-16 p-4 bg-white bg-opacity-50 rounded-2xl flex-col justify-center items-center gap-16 inline-flex">
      <div className="grid grid-cols-1 xl:grid-cols-2
      2xl:grid-cols-3 gap-16 w-full">
        <Precos valor={0} name="Suporte" lista={[
          "Até 15.000 mensagens incluídas por mês",
          "Até 3000 palavras de treinamento",
          "Treinamento personalisado por",
          "perguntas e respostas",
          "Até 3 WhatsApp bot",
          "Treinamento por WebSite",
          "Até 5 Configurações",
          "Modelo avançado (GPT4 Turbo)"
        ]} link="/ai-suporte" />
        <Precos valor={700} desconto={16.858} name="Vendas" destaque="Mais Popular" lista={[
          "Até 15.000 mensagens incluídas por mês",
          "Até 3000 palavras de treinamento",
          "Treinamento modular por",
          "perguntas e respostas",
          "Até 3 WhatsApp bot",
          "Treinamento por WebSite",
          "5 Configurações",
          "Modelo avançado (GPT-4 Turbo)",
          "Catalogo até 2000 produtos"
        ]} link="/ia-vendas" />
        <Precos valor={289} name="Restaurante" lista={[
          "Até 15.000 mensagens incluídas por mês",
          "Até 3000 palavras de treinamento",
          "Treinamento personalisado por",
          "perguntas e respostas",
          "Até 3 WhatsApp bot",
          "Treinamento por WebSite",
          "Até 5 Configurações",
          "Modelo avançado (GPT4 Turbo)"
        ]} className="xl:col-span-2 2xl:col-span-1" link="/ia-restaurante" />
      </div>
      <div className="mt-5 p-8 bg-neutral-50 rounded-[32px] shadow-md flex-col  flex gap-4 w-full h-full">
        <div className="w-full lg:w-1/3">
          <div className="flex flex-row gap-2">
            <LuBuilding2 className="text-primary-500" size={25} />
            <span className="text-black text-2xl font-bold leading-normal">Empresa</span>
          </div>
          <span>Entre em contato conosco para criar um plano expeifico para você</span>
        </div>
        <div>
          <Button className="bg-primary-500 text-white rounded-full hover:bg-primary-600	">Contate-nos</Button>
        </div>
      </div>
    </div>
  );
}
