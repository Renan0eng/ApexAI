import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AiOutlineDelete } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight, FaRegCopy } from "react-icons/fa";
import { PopoverFormFaq } from "@/components/form/popoverFormFaq";
import { MdOutlineEdit } from "react-icons/md";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { InputsAiConfig } from "@/sections/ai-config-register-view";
import { FaRegPaste } from "react-icons/fa6";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";

function downloadTxtFile(text: string, filename: string) {
  // Cria um elemento <a> temporário fora do DOM
  const element = document.createElement("a");
  // Define o conteúdo do arquivo como a string fornecida
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  // Define o nome do arquivo
  element.setAttribute("download", filename);

  // Simula o clique no elemento para iniciar o download
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Defina uma função para ler o arquivo e retornar uma Promise
function readFileAsBase64(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

function readBase64AsFile(
  base64String: string,
  filename: string,
  type: string
) {
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const file = new File(byteArrays, filename, { type: type }); // Substitua 'image/jpeg' pelo tipo correto do arquivo

  return file;
}

type Props = {
  watch: UseFormWatch<InputsAiConfig>;
  setValue: UseFormSetValue<InputsAiConfig>;
};

export default function FaqDataTables({ watch, setValue }: Props) {
  const [open, setOpen] = useState(false);

  const [response, setResponse] = useState<File | string>("");
  const [quest, setQuest] = useState("");
  const [questId, setQuestId] = useState("");
  const [pgFaq, setPgFaq] = useState(0);

  return (
    <div className="gap-4 flex flex-col">
      <div className="flex justify-between lg:flex-row flex-col gap-4">
        <div className="gap-4 flex flex-col md:flex-row lg:flex-row xl:flex-row">
          <PopoverFormFaq
            open={open}
            setOpen={setOpen}
            response={response}
            setResponse={setResponse}
            quest={quest}
            setQuest={setQuest}
            questId={questId}
            setQuestId={setQuestId}
            onChange={(e) => {
              // adiciona a pergunta e resposta no array
              if (watch("faq").find((item) => item.id === questId)) {
                const index = watch("faq").findIndex(
                  (item) => item.id === questId
                );
                const newFaq = [...watch("faq")];
                newFaq[index] = {
                  id: questId,
                  quest: quest,
                  response: response,
                };
                setValue("faq", newFaq);
                return;
              }
              setValue("faq", [...watch("faq"), e]);
            }}
          >
            <Button className="gap-2 font-bold bg-success-500/90 hover:bg-success-500">
              <FaPlus size={20} />
              Adicionar FAQ
            </Button>
          </PopoverFormFaq>
          <Button
            className="gap-2 font-bold bg-blue-500/90 hover:bg-blue-500"
            onClick={async (e) => {
              e.preventDefault();
              // Use async/await para lidar com a Promise dentro do mapeamento
              const processedData = await Promise.all(
                watch("faq").map(async (e) => {
                  if (typeof e.response === "string") {
                    return {
                      id: e.id,
                      quest: e.quest,
                      response: e.response,
                    };
                  }

                  // Transforma o response em base64
                  const base64Response = await readFileAsBase64(e.response);

                  return {
                    id: e.id,
                    quest: e.quest,
                    response: `name=${e.response.name};type=${e.response.type};${base64Response}`,
                  };
                })
              );
              downloadTxtFile(JSON.stringify(processedData), "faqs.json");
            }}
          >
            <FaRegCopy size={20} />
            Exportar FAQs
          </Button>
          <Button
            className="gap-2 font-bold bg-blue-500/90 hover:bg-blue-500"
            onClick={async (e) => {
              e.preventDefault();
              const file = document.createElement("input");
              file.type = "file";
              file.accept = ".json";
              file.click();

              file.onchange = async (e) => {
                if (file.files) {
                  const fileReader = new FileReader();
                  fileReader.readAsText(file.files[0], "UTF-8");
                  fileReader.onload = (e) => {
                    const data = JSON.parse(e.target?.result as string).map(
                      (item: any) => {
                        // valida se o response é uma base64
                        if (!item.response.includes(";base64,")) {
                          return {
                            id: item.id,
                            quest: item.quest,
                            response: item.response,
                          };
                        }
                        // pega o nome do arquivo (name=)
                        const name = item.response
                          .split("name=")[1]
                          .split(";")[0];

                        // pega o type do arquivo (type=)
                        const type = item.response
                          .split("type=")[1]
                          .split(";")[0];

                        // Transforma o response de base64 para file
                        const base64Response = item.response.split(",")[1];
                        const file = readBase64AsFile(
                          base64Response,
                          name,
                          type
                        );
                        return {
                          id: item.id,
                          quest: item.quest,
                          response: file,
                        };
                      }
                    );
                    setValue("faq", data);
                  };
                }
              };
            }}
          >
            <FaRegPaste size={20} />
            Importar FAQs
          </Button>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row">
          <Button
            className="gap-2 font-bold bg-danger-500/90 hover:bg-danger-500"
            onClick={(e) => {
              e.preventDefault();
              setValue("faq", []);
            }}
          >
            <RiDeleteBin2Line size={20} />
            Limpar FAQs
          </Button>
        </div>
      </div>
      <div className="border-input border-[1px] rounded-lg ">
        <div className="rounded-t-lg border-input border-b-[1px] ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="lg:min-w-[300px] md:min-w-[300px] min-w-[0px]">
                  Perguntas
                </TableHead>
                <TableHead>Respostas</TableHead>
                <TableHead className="w-[140px] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watch("faq").length > 0 &&
                watch("faq")
                  .slice(pgFaq, pgFaq + 5)
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.quest}
                      </TableCell>
                      <TableCell>
                        {/* valda se é um file e coloca o nome dese se for */}
                        {typeof item.response === "string"
                          ? item.response
                          : item.response?.name || ""}
                      </TableCell>
                      <TableCell className="flex gap-1 p-2">
                        <Button
                          className="bg-red-500 hover:bg-red-700"
                          onClick={(e) => {
                            e.preventDefault();
                            setValue(
                              "faq",
                              watch("faq").filter(
                                (itemFaq) => itemFaq.id !== item.id
                              )
                            );
                          }}
                        >
                          <AiOutlineDelete size={20} />
                        </Button>
                        <Button
                          className="bg-blue-500 hover:bg-blue-700"
                          onClick={(e) => {
                            e.preventDefault();
                            setQuest(item.quest);
                            typeof item.response === "string"
                              ? setResponse(item.response)
                              : setResponse("");
                            setQuestId(item.id);
                            setOpen(true);
                          }}
                        >
                          <MdOutlineEdit size={20} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {!watch("faq").length && (
            <div className="flex justify-center items-center p-4">
              <span>Não há FAQs...</span>
            </div>
          )}
        </div>
        <div className="flex justify-end items-center gap-2">
          <Button
            className="bg-transparent text-neutrals-500 hover:bg-black/5 rounded-full p-2 w-[40px] h-[40px]"
            onClick={(e) => {
              e.preventDefault();
              if (pgFaq > 0) {
                setPgFaq(pgFaq - 5);
              }
            }}
          >
            <FaChevronLeft size={20} />
          </Button>
          <div>
            <span className="text-neutrals-500">
              {/* 1 - 5 de 9 */}
              {pgFaq + 1} - {pgFaq + 5} de {watch("faq").length}
            </span>
          </div>
          <Button
            className="bg-transparent text-neutrals-500 hover:bg-black/5 rounded-full p-2 w-[40px] h-[40px]"
            onClick={(e) => {
              e.preventDefault();
              if (pgFaq < watch("faq").length) {
                setPgFaq(pgFaq + 5);
              }
            }}
          >
            <FaChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
