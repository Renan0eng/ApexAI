export default function VendasSection2() {
  return (
    <div className="bg-white/60 md:p-16 p-4 rounded-xl gap-32 flex flex-col">
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
        <div className="bg-neutral-500/10 rounded-xl w-full h-[500px]"></div>
      </div>
    </div>
  );
}
