import { LuBird } from "react-icons/lu";
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils";
import { FaArrowRight, FaCheck } from "react-icons/fa6";
import { PiSealWarningBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";

type Props = {
  valor: number;
  desconto?: number;
  name: string;
  destaque?: string;
  lista: string[];
  adicional?: string;
  className?: string;
};

export default function Precos({ valor, desconto, name, destaque, lista, adicional, className }: Props) {

  const card = cva(
    "mt-5 p-8 bg-neutral-50 rounded-[32px] shadow-md flex-col justify-between items-center flex gap-16 w-full h-full",
    {
      variants: {
        destaque: {
          false: "",
          true: "bg-primary-50",
        },
      },
      defaultVariants: {
        destaque: false,
      },
    }
  )

  const main = cva(
    "relative items-center flex flex-col w-full h-full",
  )


  return (
    <div className={cn(main({}), className)}>
      {destaque && <div className="px-6 py-3 bg-primary-500 rounded-full justify-center items-center gap-2.5 inline-flex absolute ">
        <div className="text-white text-md font-bold">{destaque}</div>
      </div>}
      <div className={cn(card({ destaque: destaque ? true : false }))}>
        {/* Preço e desconto */}
        <div className="flex flex-col gap-8 w-full items-center">
          <div className="flex flex-col">
            <div className="text-black text-2xl font-bold leading-normal flex flex-row items-center ">
              <LuBird className="text-primary-500" />
              {name}
            </div>
            <div className="flex flex-col">
              {desconto && <div className="  justify-start items-end inline-flex">
                <div className="flex-col justify-start items-end inline-flex">
                  <div className="text-red-700 text-base font-semibold leading-normal line-through">R${
                    valor
                  }</div>
                </div>
                <div className="text-red-700 text-[8px] font-bold leading-[10px]">/mês</div>
              </div>}
              <div className=" justify-start items-end inline-flex">
                <div className="text-gray-600 text-[40px] font-bold leading-10">R${
                  desconto ? (valor - (valor * desconto / 100)).toFixed(0) : valor
                }</div>
                <div className="text-gray-600 text-2xl font-bold leading-normal">/mês</div>
              </div>
            </div>
          </div>
          <hr className="w-full h-0.5 bg-gray-200" />
          <div className="flex flex-col gap-3">
            {lista.map((e, id) => <div key={id} className="flex flex-row gap-2 items-center">
              <FaCheck className="text-primary-500" size={20} />
              <span className="text-sm">{e}</span>
            </div>)}
          </div>
        </div>
        <div className="flex justify-center items-center flex-col gap-8">
          {adicional && <div className="flex flex-row gap-2 items-center">
            <PiSealWarningBold className="text-primary-500" size={20} />
            <span className="text-sm">{adicional}</span>
          </div>}
          <Button className="bg-primary-500 rounded-full hover:bg-primary-600 text-white font-bold gap-2">
            <span>Contratar</span>
            <FaArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}