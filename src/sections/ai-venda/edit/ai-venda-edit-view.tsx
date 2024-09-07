"use client";
import React, { useEffect, useState } from "react";

// components
import { InputLabel } from "@/components/inputs/imput-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// hook form
import { useForm } from "react-hook-form";
import { createAiConfigSchema } from "@/lib/schema/ai-config";

// zod
import { zodResolver } from "@hookform/resolvers/zod";

// axios
import axios from "axios";
import TabsForm, { quests } from "@/components/inputs/trabs-form";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FaqDataTables from "@/components/data-tables/form-faq-table";
import { InputsAiConfig } from "../../ai-config-register-view";
import { File as Files, Group, Produto } from "@prisma/client";
import { InputsAiVenda } from "./ai-venda-register-view";
import { createAiVendaSchema } from "@/lib/schema/ai-venda";
import Produtos from "../register/produtos";
import Advanced from "../register/advanced";

export type AIVendaInFiles = {
  id: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  name: string;
  sistema: string;
  faq: string;
  max_tokens: number;
  model: string;
  temperature: number;
  stop: string;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  files: Files[];
  produtos?: {
    id: number;
    name: string;
    price: number;
    description: string;
    link: string;
    created_at: Date;
    updated_at: Date;
    user_id: string;
    group?: Group[];
    ai_config_id: string | null;
  }[];
};

export type Data = {
  id: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  name: string;
  sistema: string;
  faq: string;
  max_tokens: number;
  model: string;
  temperature: number;
  stop: string;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  files: File[];
};

export default function AiVendaEditView({
  aiConfig,
}: {
  aiConfig: AIVendaInFiles;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InputsAiVenda>({
    resolver: zodResolver(createAiVendaSchema),
    defaultValues: {
      id: aiConfig.id,
      name: aiConfig.name,
      sistema: aiConfig.sistema
        ? aiConfig.sistema.split(";;\n").map((item, index) => {
          const [quest, response] = item.split(";:;");
          const questObj = quests.find((e) => e.quest === quest && response !== undefined);

          return {
            id: questObj?.id || index.toString(),
            quest,
            response,
          };
        })
        : [],
      faq: aiConfig.faq
        ? aiConfig.faq.split("\n").map((item, index) => {
          const [quest, response] = item.split(":");
          return {
            id: index.toString(),
            quest,
            response,
          };
        })
        : [],
      file: aiConfig.files
        .filter((item) => !item.name.includes("faq="))
        .map((item) => {
          return new File([], item.name, { type: item.url });
        }),
      max_tokens: aiConfig.max_tokens,
      model: aiConfig.model,
      temperature: aiConfig.temperature,
      stop: aiConfig.stop,
      top_p: aiConfig.top_p,
      frequency_penalty: aiConfig.frequency_penalty,
      presence_penalty: aiConfig.presence_penalty,
      produto:
        aiConfig.produtos?.map((item) => {
          return {
            name: item.name,
            price: item.price,
            description: item.description,
            link: item.link,
            group: item.group?.map((e) => e.name).join(","),
          };
        }) || [],
    },
  });
  useEffect(() => {
    console.log("errors", errors);
    console.log("watch", watch());
  }, [errors]);


  const onSubmit = async (data: InputsAiVenda) => {
    const { file, ...objData } = {
      ...data,
      action: "update",
      sistema: data.sistema
        .map((item) => {
          if (!item.response || !item.quest) return null;
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
        formData.append("fileFaq", item.response);
        return {
          ...item,
          response: item.response.name,
        };
      }
      return item;
    });

    formData.append("data", JSON.stringify({ ...objData, faq }));

    const ret = await axios.post("/api/ai-venda", formData);
    if (ret.status === 200) {
      router.back();
    }
  };

  const [produto, setProduto] = useState(false);

  const [advanced, setAdvanced] = useState(false);

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
        <Link href="/ai-venda">
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
