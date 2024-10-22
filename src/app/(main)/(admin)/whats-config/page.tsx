"use client";
import React, { useEffect, useState } from "react";

// components
import { InputLabel } from "@/components/inputs/imput-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// hook form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import QRCode from "react-qr-code";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { Combobox } from "@/components/ui/combobox";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { createWhatsappClientSchema } from "@/lib/schema/whatsapp/client";

// types
type Inputs = {
  name: string;
  configId: string;
};

type WhatsappClientData = Prisma.WhatsappClientGetPayload<{
  include: {
    ai_config: true;
  };
}>;

export default function AiConfig() {
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const [aiConfigs, setAiConfigs] = useState<Prisma.AIConfigGetPayload<{}>[]>();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(createWhatsappClientSchema),
  });

  const onSubmit = async (data: Inputs) => {
    const res = await axios.post("/api/whatsapp/client", data);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      setLoading(true);

      const res = await axios.get("/api/qrcode");

      if (!res.data.qrCode) {
        return;
      }

      console.log("Data: ", res.data);

      setReady(res.data.ready);
      setQrCode(res.data.qrCode);
      setActive(res.data.active);
      setLoading(false);
    }, 5000);

    const fetchAiConfigs = async () => {
      const res = await axios.get("/api/ai-config");

      setAiConfigs(res.data)
    }

    const fetchClient = async () => {
      const { data } = await axios.get("/api/whatsapp/client");

      const whatsappConfig: WhatsappClientData = data.whatsappConfig;

      if (whatsappConfig) {
        // console.log(whatsappConfig);

        setValue("name", whatsappConfig.name ?? "");
        setValue("configId", whatsappConfig.ai_config?.id ?? "");
      }
    }

    fetchAiConfigs();
    fetchClient();
    return () => clearInterval(interval);
  }, [setValue]);

  const handleDelete = async () => {
    await axios.delete("/api/whatsapp/client");
  };

  const handleDisable = async () => {
    await axios.put("/api/whatsapp/client", {
      active: active ? false : true,
    });
  }

  return (
    <main>
      <div className="px-8">
        <h1 className="font-bold text-3xl">Configuração Whatsapp</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col px-[calc(8px+1rem)] lg:px-28 xl:px-32 mt-4 gap-y-8 py-8"
      >
        <div
          className="
        grid md:grid-cols-2 sm:grid-cols-1
        lg:gap-x-16 xl:gap-x-32 md:gap-x-8
        "
        >
          <div className="items-center flex flex-col">
            <InputLabel
              label="Nome Seção"
              description="Nomeie sua seção para identificação"

            >
              <Input {...register("name", { required: true })} />
              {/* errors will return when field validation fails  */}
              {errors.name && (
                <span className="text-danger-500">{errors.name.message}</span>
              )}
            </InputLabel>
            <InputLabel
              label="Modelo"
              description="Escolha o modelo de AI que deseja usar, este parametro reflete no preço por tokens"
              className=""
            >
              <Combobox
                options={aiConfigs ? aiConfigs.map((config) => {
                  return {
                    label: config.name,
                    value: config.id
                  }
                }) : []}
                onSelect={(value) => {
                  setValue("configId", value);
                }}
                value={watch("configId")}
                placeholder="Configuração de IA"
              />
              {errors.configId && (
                <span className="text-danger-500">{errors.configId.message}</span>
              )}
            </InputLabel>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 relative">
            {loading ? (
              <BeatLoader
                color="#36d7b7"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            ) : null}
            <h1 className="font-bold text-neutrals-500">Whatsapp</h1>
            <QRCode value={qrCode} opacity={ready || loading ? 0.3 : 1} />
            <h2 className="font-bold text-neutrals-500">
              Escaneie o QRCode para conectar o Whatsapp
            </h2>
          </div>
        </div>
        <div
          className="
        grid md:grid-cols-2 grid-cols-1
        lg:gap-x-16 xl:gap-x-32 md:gap-x-8
        gap-y-8 "
        >
          <div />
          <Button
            type="submit"
            disabled={!ready}
            className="w-full bg-primary-500 hover:bg-secondary-500"
          >
            Cadastrar
          </Button>
          <Button
            onClick={handleDelete}
            disabled={aiConfigs?.length === 0}
            className={`w-full ${ready ? "bg-red-500 hover:bg-red-700" : "bg-primary-500 hover:bg-secondary-500"}`}
          >
            Desconectar
          </Button>
          <Button
            onClick={handleDisable}
            disabled={aiConfigs?.length === 0}
            className={`w-full ${active ? "bg-red-500 hover:bg-red-700" : "bg-primary-500 hover:bg-secondary-500"}`}
          >
            {active ? "Desativar" : "Ativar"}
          </Button>
        </div>
      </form>
    </main>
  );
}
