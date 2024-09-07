import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { FaCheck, FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";

export default function HomeFooter() {
  return (
    <div className='flex w-full py-4 justify-between items-center md:flex-row flex-col gap-8'>
      <div className='flex flex-col justify-center items-start gap-4'>
        <div className='flex px-4 py-2 items-center gap-2'>
          <Image src='/logo_black.png' width={248} height={66} alt="logo" />
        </div>
        <div className='flex justify-between items-center self-stretch'>
          <div className='flex w-full justify-center items-center gap-4'>
            <Button className='flex p-2 rounded-full bg-primary-500/25 hover:bg-primary-500/50 transition-colors duration-200 group'>
              <FaInstagram size={24} className='text-primary-500 group-hover:text-white transition-colors duration-200' />
            </Button>
            <Button className='flex p-2 rounded-full bg-primary-500/25 hover:bg-primary-500/50 transition-colors duration-200 group'>
              <FaFacebook size={24} className='text-primary-500 group-hover:text-white transition-colors duration-200' />
            </Button>
            <Button className='flex p-2 rounded-full bg-primary-500/25 hover:bg-primary-500/50 transition-colors duration-200 group'>
              <FaLinkedin size={24} className='text-primary-500 group-hover:text-white transition-colors duration-200' />
            </Button>
            <Button className='flex p-2 rounded-full bg-primary-500/25 hover:bg-primary-500/50 transition-colors duration-200 group'>
              <FaWhatsapp size={24} className='text-primary-500 group-hover:text-white transition-colors duration-200' />
            </Button>
          </div>
        </div>
      </div>
      <div className='flex w-[338px] flex-col items-start gap-1'>
        <div className='flex items-start gap-2'>
          <span className='text-[14px] text-slate-900'>Assine nossa newsletter</span>
        </div>
        <div className='flex items-start gap-1 self-stretch'>
          <Input className='flex items-start gap-2 border-gray-400 w-[197px]' placeholder='Email'>
          </Input>
          <Button className='flex items-center justify-center bg-primary-500 text-white text-[14px] px-4 py-2 rounded-full'>
            Assinar
          </Button>
        </div>
      </div>
    </div>
  )
}