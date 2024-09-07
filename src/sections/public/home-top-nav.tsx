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
            backgroundImage: "url('https://cdn.discordapp.com/attachments/1048010244795678771/1169737777072590969/AIPEX_LOGO_light.png?ex=65567e32&is=65440932&hm=c5661bf76a5eefe78815e6821382ada234a600cf63469015c12599c68a586890&')",
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