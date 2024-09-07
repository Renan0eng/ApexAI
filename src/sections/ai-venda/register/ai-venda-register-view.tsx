"use client";
import React, { useEffect, useState } from "react";

// components
import { InputLabel } from "@/components/inputs/imput-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// hook form
import { useForm } from "react-hook-form";

// zod
import { zodResolver } from "@hookform/resolvers/zod";

// axios
import axios from "axios";
import TabsForm from "@/components/inputs/trabs-form";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Advanced from "./advanced";
import Produtos from "./produtos";
import { createAiVendaSchema } from "@/lib/schema/ai-venda";

// types
export type InputsAiConfig = {
  id?: string;
  name: string;
  site: string;
  sistema: {
    id: string;
    quest: string;
    response: string;
  }[];
  max_tokens: number;
  model: string;
  temperature: number;
  stop: string;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  faq: {
    id: string;
    quest: string;
    response: string | File;
  }[];
  file: File[];
  produto: {
    name: string;
    price: number;
    description: string;
    link: string;
    group: string;
  }[];
};

export default function AiVendaRegisterView() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InputsAiConfig>({
    resolver: zodResolver(createAiVendaSchema),
    defaultValues: {
      name: "",
      site: "",
      sistema: [],
      max_tokens: 2048,
      model: "gpt-4-1106-preview",
      temperature: 1,
      stop: "",
      top_p: 0.5,
      frequency_penalty: 1,
      presence_penalty: 1,
      faq: [],
      file: [],
      produto: [],
    },
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const onSubmit = async (data: InputsAiConfig) => {
    const { file, ...objData } = {
      ...data,
      sistema: data.sistema
        .map((item) => {
          if (!item.response) return;
          return `${item.quest};:;${item.response}`;
        })
        .join(";;\n")
        .trim(),
    };

    const formData = new FormData();

    // envia um array de arquivos
    data.file?.forEach((item) => {
      formData.append("file", item);
    });

    // valida se o faq tem um arquivo na resposta

    const faq = data.faq.map((item) => {
      if (item.response instanceof File) {
        console.log("item.response", item.response);
        formData.append("fileFaq", item.response);
        return {
          ...item,
          response: item.response.name,
        };
      }
      return item;
    });

    console.log("faq", faq);

    formData.append("data", JSON.stringify({ ...objData, faq }));
    const ret = await axios.post("/api/ai-venda", formData);
    if (ret.status === 200) {
      router.back();
    }
  };

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/web-scraping", {
        site: watch("site"),
      });

      console.log(res.data);

      res.data.message.split("\n").map((item: string) => {
        const [pergunta, resposta] = item.split(":");

        if (!pergunta || !resposta) return;

        switch (pergunta) {
          case "Qual o nome da empresa":
            setValue("name", resposta);
            break;
          case "Quais são os principais produtos ou serviços oferecidos pela empresa":
            // Não entendi como que seta essa porra então não dá pra mudar o setValue ;-;
            break;
          case "Horário de atendimento":
            // Não entendi como que seta essa porra então não dá pra mudar o setValue ;-;
            break;
          case "Como entrar em contato com a empresa":
            // Não entendi como que seta essa porra então não dá pra mudar o setValue ;-;
            break;
          case "Endereço da empresa":
            // Não entendi como que seta essa porra então não dá pra mudar o setValue ;-;
            break;
          default:
            break;
        }

        console.log("pergunta", pergunta);
        console.log("resposta", resposta);
      });
    } catch (error: any) {
      console.error(error.response);
    }
  };

  const [advanced, setAdvanced] = useState(false);

  const [produto, setProduto] = useState(false);

  return (
    <main>
      <div
        className="flex 
      lg:flex-row 
      md:flex-row 
      flex-col 
      justify-between gap-4 text-center px-[calc(8px+1rem)] lg:px-28 xl:px-32"
      >
        <h1 className="lg:text-4xl md:text-4xl font-bold text-2xl">
          Cadastro de IA
        </h1>
        <Link href="/ai-config">
          <Button className="bg-primary-500 hover:bg-secondary-500 text-white font-bold py-2 px-4 rounded-full items-center w-full">
            <Undo2 size={24} />
            Voltar
          </Button>
        </Link>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col px-[calc(8px+1rem)] lg:px-28 xl:px-32 mt-4 gap-y-8 py-8"
      >
        <div
          className="
        grid md:grid-cols-2 sm:grid-cols-1
        lg:gap-x-16 xl:gap-x-32 md:gap-x-8"
        >
          <div>
            <InputLabel label="Nome da AI" description="Nomeie sua AI.">
              <Input {...register("name", { required: true })} />
              {/* errors will return when field validation fails  */}
              {errors.name && (
                <span className="text-danger-500">{errors.name.message}</span>
              )}
            </InputLabel>
          </div>
          <div className="flex gap-2 ">
            <InputLabel
              label="Site"
              description="Responda suas perguntas com seu web site"
            >
              <div className="flex gap-2">
                <Input
                  {...register("site")}
                  placeholder="Exemplo https://aipex.com.br/"
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
          </div>
        </div>
        <div className="flex justify-center">
          <InputLabel
            label="Configuração AI"
            description="Este será o contexto que a AI usara para interagir."
          >
            <TabsForm
              onChange={(e, quest) => {
                const index = watch("sistema").findIndex(
                  (item) => item.id === quest.id
                );
                if (index === -1) {
                  setValue("sistema", [
                    ...watch("sistema"),
                    {
                      id: quest.id,
                      quest: quest.quest,
                      response: e,
                    },
                  ]);
                } else {
                  const newSistema = [...watch("sistema")];
                  newSistema[index] = {
                    id: quest.id,
                    quest: quest.quest,
                    response: e,
                  };
                  setValue("sistema", newSistema);
                }
              }}
              value={watch("sistema")}
            />
            {/* errors will return when field validation fails  */}
            {errors.sistema && (
              <span className="text-danger-500">{errors.sistema.message}</span>
            )}
          </InputLabel>
        </div>
        <Produtos
          setVal={setValue}
          wat={watch}
          produto={produto}
          setProduto={setProduto}
        />
        <Advanced
          advanced={advanced}
          setValue={setValue}
          watch={watch}
          errors={errors}
          register={register}
          setAdvanced={setAdvanced}
        />
        <div
          className="
        grid md:grid-cols-2 sm:grid-cols-1
        lg:gap-x-16 xl:gap-x-32 md:gap-x-8
        gap-y-8 justify-end"
        >
          <div />
          <Button
            type="submit"
            className="w-full bg-primary-500 hover:bg-secondary-500"
          >
            Cadastrar
          </Button>
        </div>
      </form>
    </main>
  );
}
