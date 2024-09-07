import { FaCheck } from "react-icons/fa6";

export default function HomeSection4() {
  return (
    <div className='bg-white/60 md:p-16 p-4 rounded-xl flex gap-16 flex-col xl:flex-row justify-center xl:justify-between items-center'>
      <div className='flex flex-col gap-3  flex-1'>
        <div className='flex flex-col gap-3'>
          <span className='text-[42px] leading-[45px]'>Melhoria contínua</span>
          <span className='text-neutrals-500 text-sm'>  Chatbots podem coletar feedback dos clientes ou usuários internos em tempo real. Isso proporciona uma fonte constante de dados para identificar áreas que precisam de melhorias imediatas.</span>
        </div>
        <div className='text-primary-500 gap-3 flex flex-col'>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Feedback em Tempo Real</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Análise de Dados Precisa</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Identificação de Problemas Recorrentes</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Atualizações Contínuas</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Personalização Aperfeiçoada</span>
          </div>
        </div>
      </div>
      <div className=' bg-neutral-500/10 rounded-tl-3xl rounded-br-3xl h-[300px] w-[300px]' style={{
        backgroundImage: "url('https://media.discordapp.net/attachments/1083082099994673184/1186224350265880616/Frame_2608925_2.png?ex=65927884&is=65800384&hm=c87145a7eb7bb31428886e04423d0806e0d32c2975c55f49781cd4fcaa91b8e2&=&format=webp&quality=lossless')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}>
      </div>
    </div>
  )
}