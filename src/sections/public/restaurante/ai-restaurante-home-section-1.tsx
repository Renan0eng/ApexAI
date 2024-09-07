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
              Atendente de Restaurantes            </span>
            <span className="text-sm font-medium text-neutrals-500 max-w-[500px]">
              O Atendente de Restaurantes com Inteligência Artificial é uma solução revolucionária projetada para otimizar e aprimorar a experiência de atendimento ao cliente em estabelecimentos gastronômicos. Combinando tecnologia avançada e funcionalidades inteligentes, este sistema oferece uma gama de benefícios excepcionais para restaurantes de todos os tamanhos.
            </span>
            <div className="text-primary-500 gap-2 flex flex-col">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Treinamento abrangente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Interação com o Cliente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Facilidade de Pagamento via Pix</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Rastreamento e Validação</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Aumento da eficiência no atendimento</span>
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
