import { useState } from "react";
import { Tabs, TabsContent, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Title } from "@tremor/react";
import { Textarea } from "../ui/textarea";

export const quests = [
  {
    id: "nome",
    quest: "Qual o nome da empresa?",
    placeholder: "Ex: Dia de Pizza, Steak House , etc...",
  },
  {
    id: "produtos",
    quest:
      "Quais são os principais produtos ou serviços oferecidos pela empresa?",
    placeholder: "Ex: Venda de roupas, venda de sapatos, etc...",
  },
  {
    id: "horario",
    quest: "Horário de atendimento?",
    placeholder: "Ex: 08:00 as 18:00 de sexta a domingo",
  },
  {
    id: "contato",
    quest: "Como entrar em contato com a empresa?",
    placeholder: "Ex: (00) 00000-0000 ou site www.exemplo.com",
  },
  {
    id: "localizacao",
    quest: "Endereço da empresa?",
    placeholder: "Ex: Rua Exemplo, 000, Bairro Exemplo, Cidade Exemplo",
  },
  {
    id: "sobre",
    quest: "Funções especificas para a empresa?",
    placeholder: "Ex: Enviar cardápio no link, etc...",
  },
  {
    id: "missao",
    quest: "Qual a missão da empresa?",
    placeholder: "Ex: Fornecer produtos de qualidade, etc...",
  },
];

type Props = {
  onChange: (
    value: string,
    quest: {
      id: string;
      quest: string;
    }
  ) => void;
  value: {
    id: string;
    quest: string;
    response: string;
  }[];
};

export default function TabsForm({ onChange, value }: Props) {
  const [activeTab, setActiveTab] = useState(quests[0].id);

  return (
    <form>
      <Tabs defaultValue={quests[0].id} className="w-full" value={activeTab}>
        {quests.map((quest, index) => (
          <TabsContent value={quest.id} key={index}>
            <div className="flex flex-col gap-2">
              <Title>{quest.quest}</Title>
              <Textarea
                className="w-full h-[150px]"
                placeholder={quest.placeholder}
                onChange={(e) => {
                  onChange(e.target.value, quest);
                }}
                value={
                  value.find((item) => item?.quest === quest.quest)?.response || ""
                }
              />
              <div className="flex gap-2">
                {index > 0 && (
                  <Button className="bg-primary-500 hover:bg-primary-500/75"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(quests[index - 1].id);
                    }}
                  >
                    Voltar
                  </Button>
                )}
                {index < quests.length - 1 && (
                  <Button className="bg-primary-500 hover:bg-primary-500/75"
                    onClick={(e) => {
                      setActiveTab(quests[index + 1].id);
                    }}
                  >
                    Próximo
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </form>
  );
}
