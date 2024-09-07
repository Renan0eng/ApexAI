import FaqDataTables from "@/components/data-tables/form-faq-table";
import { InputLabel } from "@/components/inputs/imput-label";
import SwitchLabel from "@/components/inputs/switch-label";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type Props = {
  register: any;
  setValue: any;
  watch: any;
  errors: any;
  advanced: boolean;
  setAdvanced: any;
};

export default function Advanced({
  register,
  setValue,
  watch,
  errors,
  advanced,
  setAdvanced,
}: Props) {
  return (
    <div >
      <SwitchLabel
        label="Configurações avançadas"
        value={advanced}
        onChange={(e) => {
          setAdvanced(e);
        }}
      />
      <div style={{ display: advanced ? "flex" : "none", flexDirection: "column" }}>
        <div className="pb-8 no-scrollbar">
          <InputLabel
            label="FAQ"
            description="Adicione perguntas e respostas para sua AI."
          >
            <FaqDataTables setValue={setValue} watch={watch} />
          </InputLabel>
        </div>
        <div
          className="
  grid md:grid-cols-2 sm:grid-cols-1
  lg:gap-x-16 xl:gap-x-32 md:gap-x-8
  gap-y-8"
        >
          {/* upload file */}
          {/* <InputLabel label="Arquivo" description="Envie arquivo.">
        <Input
          type="file"
          accept=".jpg, .jpeg, .png, .pdf, .xlsx, .csv"
          onChange={(e) => {
            if (!e.target.files) return;
            const file = e.target.files[0];
            setValue("file", [...watch("file"), file]);
            console.log("watch", watch("file"));
          }}
        />
        {errors.file && (
          <span className="text-danger-500">{errors.file.message}</span>
        )}
        <Label className="text-sm text-gray-500 flex flex-col">
          Arquivos:
          {watch("file").map((item, index) => (
            <span
              key={index}
              className="text-primary-500 flex flex-row items-center gap-2"
              onClick={(e) =>
                setValue(
                  "file",
                  watch("file").filter((e) => e.name != item.name)
                )
              }
            >
              <MdDeleteForever size={18} /> {item?.name}
            </span>
          ))}
        </Label>
      </InputLabel> */}
          <InputLabel
            label="Modelo"
            description="Escolha o modelo de AI que deseja usar, este parametro reflete no preço por tokens"
          >
            <Combobox
              options={[
                {
                  value: "gpt-3.5-turbo-1106",
                  label: "GPT-3 Turbo 1106",
                },
                {
                  value: "gpt-3.5-turbo",
                  label: "GPT-3 Turbo",
                },
                {
                  value: "gpt-4-1106-preview",
                  label: "GPT-4 1106 preview",
                },
              ]}
              onSelect={(value) => {
                setValue("model", value);
              }}
              placeholder="Modelo"
            />
            {/* errors will return when field validation fails  */}
            {errors.model && (
              <span className="text-danger-500">{errors.model.message}</span>
            )}
          </InputLabel>
          <InputLabel
            label="Max Tokens Atendimento"
            description="Limite de tamanho da resposta para o cliente. "
            value={watch("max_tokens")}
          >
            <Slider
              max={4096 as any}
              min={1 as any}
              step={1}
              defaultValue={[watch("max_tokens")]}
              onValueChange={(e) => setValue("max_tokens", e[0])}
            />
            {/* errors will return when field validation fails  */}
            {errors.max_tokens && (
              <span className="text-danger-500">
                {errors.max_tokens.message}
              </span>
            )}
          </InputLabel>
          <InputLabel
            label="Temperatura AI"
            description=" Controla a aleatoriedade das respostas geradas."
            value={watch("temperature")}
          >
            <Slider
              max={2 as any}
              min={0 as any}
              step={0.01}
              defaultValue={[watch("temperature")]}
              onValueChange={(e) => setValue("temperature", e[0])}
            />
            {/* errors will return when field validation fails  */}
            {errors.temperature && (
              <span className="text-danger-500">
                {errors.temperature.message}
              </span>
            )}
          </InputLabel>
          <InputLabel
            label="Qualidade"
            description="Isso permite que você gere respostas de alta qualidade, eliminando tokens menos relevantes."
            value={watch("top_p")}
          >
            <Slider
              max={1 as any}
              min={0 as any}
              step={0.01}
              defaultValue={[watch("top_p")]}
              onValueChange={(e) => setValue("top_p", e[0])}
            />
            {/* errors will return when field validation fails  */}
            {errors.top_p && (
              <span className="text-danger-500">{errors.top_p.message}</span>
            )}
          </InputLabel>
          <InputLabel
            label="Black List"
            description="Permite que você especifique uma string para indicar ao modelo quando parar a geração da resposta, separe as palavras com uma “,”."
          >
            <Input {...register("stop", { required: true })} />
            {/* errors will return when field validation fails  */}
            {errors.stop && (
              <span className="text-danger-500">{errors.stop.message}</span>
            )}
          </InputLabel>
          <InputLabel
            label="Presença"
            description="Reduz a probabilidade de o modelo incluir palavras específicas na resposta."
            value={watch("presence_penalty")}
          >
            <Slider
              max={2 as any}
              min={0 as any}
              step={0.01}
              defaultValue={[watch("presence_penalty")]}
              onValueChange={(e) => setValue("presence_penalty", e[0])}
            />
            {/* errors will return when field validation fails  */}
            {errors.presence_penalty && (
              <span className="text-danger-500">
                {errors.presence_penalty.message}
              </span>
            )}
          </InputLabel>
          <InputLabel
            label="Frequencia"
            description="Aumenta ou diminui a frequência de uso de palavras."
            value={watch("frequency_penalty")}
          >
            <Slider
              max={2 as any}
              min={0 as any}
              step={0.01}
              defaultValue={[watch("frequency_penalty")]}
              onValueChange={(e) => setValue("frequency_penalty", e[0])}
            />
            {/* errors will return when field validation fails  */}
            {errors.frequency_penalty && (
              <span className="text-danger-500">
                {errors.frequency_penalty.message}
              </span>
            )}
          </InputLabel>
        </div>
      </div>
    </div>
  )
}