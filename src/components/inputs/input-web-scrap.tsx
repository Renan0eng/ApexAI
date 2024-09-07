// components
import { InputLabel } from "@/components/inputs/imput-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//forms
import { UseFormSetValue, UseFormWatch, useForm } from "react-hook-form";

// zod
import { zodResolver } from "@hookform/resolvers/zod";

// axios
import axios from "axios";
import { quests } from "@/components/inputs/trabs-form";
import { InputsAiConfig } from "@/sections/ai-config-register-view";

export type WebScrapTypes = {
  site: string;
  sistema: {
    id: string;
    quest: string;
    response: string;
  }[];
};

type Props = {
  setVal: UseFormSetValue<InputsAiConfig>;
  wat: UseFormWatch<InputsAiConfig>;
};

export function InputWebScrap({ setVal, wat }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WebScrapTypes>({
    defaultValues: {
      site: "",
    },
  });

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/web-scraping", {
        site: watch("site"),
      });

      // console.log("response", res.data.message);

      const separar = res.data.message
        .split("\n")
        .map((item: string, index: number) => {
          const [pergunta, resposta] = item.split(":");

          const questObj = quests.find((e) => e.quest === pergunta);

          setVal("sistema", [
            ...wat("sistema"),
            {
              id: questObj?.id || index.toString(),
              quest: pergunta,
              response: resposta.trim(),
            },
          ]);

          // console.log("questObj", questObj);
          // console.log("sistema", wat("sistema"));

          // console.log("pergunta", pergunta);
          // console.log("resposta", resposta);
        });

      console.log("separar", separar);
    } catch (error: any) {
      console.error(error.response);
    }
  };
  return (
    <InputLabel
      label="Site"
      description="Responda suas perguntas com sua página de apresentação da empresa."
    >
      <div className="flex gap-2">
        <Input
          {...register("site")}
          placeholder="Exemplo https://aipex.com.br/sobre-nos/"
        />
        <div>
          <Button
            className="bg-primary-500 hover:bg-primary-500/75 font-bold"
            onClick={onSearch}
          >
            Procurar
          </Button>
        </div>
      </div>
    </InputLabel>
  );
}
