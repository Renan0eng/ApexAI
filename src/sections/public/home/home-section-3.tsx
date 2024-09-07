
import { FaCheck } from "react-icons/fa6";

export default function HomeSection3() {
  return (
    <div className='bg-white/60 md:p-16 p-4 rounded-xl flex gap-16 flex-col xl:flex-row-reverse justify-center xl:justify-between items-center'>
      <div className='flex flex-col gap-3  flex-1'>
        <div className='flex flex-col gap-3'>
          <span className='text-[42px] leading-[45px]'>Vantagens econômicas</span>
          <span className='text-neutrals-500 text-sm'> Chatbots podem lidar com um grande volume de consultas e tarefas sem a necessidade de contratar uma equipe adicional</span>
        </div>
        <div className='text-primary-500 gap-3 flex flex-col'>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Redução de Custos Operacionais</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Eficiência no Atendimento ao Cliente</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Análise de Dados e Insights</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Escala e Flexibilidade</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-primary-500/20 flex rounded-full'>
              <FaCheck />
            </div>
            <span>Atendimento Multicanal</span>
          </div>
        </div>
      </div>
      <div className=' bg-neutral-500/10 rounded-tl-3xl rounded-br-3xl h-[300px] w-[300px]' style={{
        backgroundImage: "url('https://media.discordapp.net/attachments/1083082099994673184/1186224350504964127/Frame_2608925_1.png?ex=65927884&is=65800384&hm=42d192b7c2faef773717e31a7e368958a2529913ae8c4e0d7b10cab0f453a870&=&format=webp&quality=lossless')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}>
      </div>
    </div>
  )
}