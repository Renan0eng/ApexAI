import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

export default function HomeSection1() {
  return (
    <div className="bg-white/60 md:p-16 p-4 rounded-xl gap-32 flex flex-col">
      <div className="flex flex-col gap-8 xl:flex-row justify-between">
        <div className="gap-8 flex flex-col xl:w-1/2 w-full">
          <div className="flex flex-col gap-2 font-semibold">
            <span className="text-primary-500 text-sm">
              Converta visitantes em clientes
            </span>
            <span className="text-[42px] leading-[45px] font-medium">
              Pare de{" "}
              <span className="font-semibold text-danger-500">
                Perder Dinheiro
              </span>{" "}
              enquanto dorme, nos cuidamos do seu negócio
            </span>
            <div className="text-primary-500 gap-2 flex flex-col">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Configure em 5 min. Suporta mais de 175 idiomas</span>
              </div>
              <div className="flex items-center gap-2 text-warning-500">
                <div className="p-2 bg-warning-500/25 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Redução de Custos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Atendimento Personalizado</span>
              </div>
              <div className="flex items-center gap-2 text-warning-500">
                <div className="p-2 bg-warning-500/25 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Respostas Rápidas e Precisas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/20 flex rounded-full">
                  <FaCheck />
                </div>
                <span>Disponibilidade 24/7</span>
              </div>
            </div>
          </div>
          <div>
            <Button className="rounded-full bg-primary-500 hover:bg-secondary-500 gap-2 font-bold">
              <span>Configurar IA</span>
              <FaArrowRight size={16} />
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center min-w-[280px]">
          <div className="bg-neutral-500/10 rounded-xl w-[280px] h-[400px]"></div>
        </div>
      </div>
      <div className="flex flex-col gap-16 ">
        <div className="flex flex-col text-center gap-2 font-semibold">
          <span className="text-primary-500 text-sm">
            Tempo é precioso. Comece na frente com a AIpex
          </span>
          <span className="text-[42px] leading-[45px] ">
            Tudo pronto em <span className="text-danger-500">5 Minutos</span>
          </span>
          <span className="text-neutrals-500/75 text-sm">
            Para criar a IA perfeita para o seu negócio
          </span>
        </div>
        <div className=" rounded-xl w-full overflow-hidden">
          <video className="w-full " autoPlay loop muted>
            <source src="/video/denovosaporra.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
