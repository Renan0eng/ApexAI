import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa";

export default function HomeSection6() {
  return (
    <div className='flex md:p-16 p-8 flex-col items-start gap-2 self-stretch rounded-[16px] bg-primary-300'>
      <div className='flex flex-col items-start gap-8 '>
        <div className='flex flex-col items-start gap-2 md:w-1/2'>
          <span className='text-white text-[14px]'>Identificação de Problemas Recorrentes</span>
          <span className='text-white md:text-[40px] text-[30px] font-bold'>Converta visitantes em clientes mesmo enquanto você dorme</span>
          <Button className='rounded-full bg-white text-neutrals-500 hover:bg-white/80 font-bold'>Contate-nos</Button>
        </div>
      </div>
    </div>
  )
}