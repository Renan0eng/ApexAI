'use client'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

export default function HomeTopNav() {

  const [openNav, setOpenNav] = useState(false)

  return (
    <div className="py-4 bg-[#f0f0f321] backdrop-blur-sm fixed  w-full px-4 z-20 flex items-center justify-center">
      <div className='flex flex-row justify-between items-center w-11/12 lg:w-2/3'>
        <Link href="/">
          <div className="h-[66px] md:w-[250px] w-[100px]" style={{
            backgroundImage: "url(/logo_black.png)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }} />
        </Link>
        <div className='md:flex gap-8 font-semibold text-neutrals-500 hidden'>
          <Link href="/">
            Preços
          </Link>
          <Link href="/">
            Sobre
          </Link>
          <div className='flex gap-1'>
            <span>
              Mais
            </span>
            <div onClick={() => { setOpenNav(!openNav) }} className='justify-center items-center flex p-1' >
              {openNav ? <FaChevronDown /> :
                <FaChevronUp />}
            </div>
          </div>
        </div>
        <div className='flex gap-3'>
          <Link href="/login">
            <Button className='rounded-full bg-white text-neutrals-500 hover:bg-primary-500/10'>
              Entrar
            </Button>
          </Link>
          <Link href="/registrar">
            <Button className='rounded-full bg-primary-500 hover:bg-secondary-500'>
              Cadastrar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}