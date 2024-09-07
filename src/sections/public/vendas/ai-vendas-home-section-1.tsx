import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

export default function VendasSection1() {
  return (
    <div className="bg-white/60 md:p-16 p-4 rounded-xl gap-32 flex flex-col">
      <div className="flex flex-col gap-8 xl:flex-row justify-between">
        <div className="gap-8 flex flex-col xl:w-1/2 w-full">
          <div className="flex flex-col gap-4 font-semibold items-center">
            <span className="text-[42px] leading-[45px] text-primary-500 text-center max-w-[500px] font-bold">
              Vendedor com Inteligência Artificial
            </span>
            <span className="text-sm font-medium text-neutrals-500 max-w-[500px]">
              Transforme a experiência de vendas e atendimento ao cliente com o nosso revolucionário Vendedor com Inteligência Artificial. Este software avançado é a solução definitiva para impulsionar suas vendas e interações com os clientes.
            </span>
            <div className="text-primary-500 gap-2 flex flex-col">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Até 15.000 mensagens incluídas por mês</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Até 3000 palavras de treinamento</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Treinamento personalisado por perguntas e respostas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Até 3 WhatsApp bot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Treinamento por WebSite</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Até 5 Configurações</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Modelo avançado (GPT-4 Turbo)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Catalogo até 2000 produtos</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center min-w-[280px]">
          <div className="bg-neutral-500/10 rounded-xl w-[280px] h-[400px]"></div>
        </div>
      </div>
    </div>
  );
}
