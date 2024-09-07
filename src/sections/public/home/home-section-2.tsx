import { FaCheck } from "react-icons/fa6";

export default function HomeSection2() {
  return (
    <div className='bg-white/60 md:p-16 p-4 rounded-xl flex gap-16 flex-col xl:flex-row justify-center xl:justify-between items-center'>
      <div className='flex flex-col gap-3  flex-1'>
        <div className='flex flex-col gap-3'>
          <span className='text-[42px] leading-[45px]'>Vantagens para os funcionários</span>
          <span className='text-neutrals-500 text-sm'> Implementar chatbots com Inteligência Artificial (IA) em uma empresa pode trazer vantagens significativas para os funcionários</span>
        </div>
        <div className='text-primary-500 gap-3 flex flex-col'>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Acesso Rápido à Informação</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Suporte Interno</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Alívio de Tarefas Repetitivas</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Treinamento e Capacitação</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Automação de Processos Internos</span>
          </div>
        </div>
      </div>
      <div className=' bg-neutral-500/10 rounded-tl-3xl rounded-br-3xl h-[300px] w-[300px]' style={{
        backgroundImage: "url('https://cdn.discordapp.com/attachments/1083082099994673184/1186224350014230609/Frame_2608925.png?ex=65927884&is=65800384&hm=afc87ae0f9d3d60b0fc2d013848bfe01864ddfce31502d2d8484b88b69934b16&')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}>
      </div>
    </div>
  )
}