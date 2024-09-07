import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { Button } from "../ui/button";
import { Delete, Edit } from "lucide-react";

type Props = {
  data: any[];
  handleDelete: (id: string) => void;
  viewValue: { id: string, label: string }[];
  route: string;
};

export default function AccordionDataTable({ data, handleDelete, viewValue, route }: Props) {

  return (
    <Accordion type="single" collapsible>
      <Command>
        <CommandInput placeholder={"Pesquisa..."} className='text-base' />
        <CommandEmpty>Não encontrado.</CommandEmpty>
        <CommandGroup className='p-0'>
          {data.map((item) => (
            <CommandItem
              key={item.id}
              value={item.name}
              className='p-0 m-0'
            >
              <AccordionItem
                className='w-full'
                value={item.id}
                key={item.id}>
                <AccordionTrigger className='px-4 text-xl'>
                  {item.name}
                </AccordionTrigger>
                <AccordionContent className='px-4'>
                  <div className='flex justify-between'>
                    <div className='flex flex-col text-neutral-500'>
                      {viewValue.map((value, index) =>
                        <span key={index}>
                          <span className='text-neutral-950'>{value.label}</span>
                          {item[value.id]}
                        </span>
                      )}
                    </div>
                    <div className='gap-4 flex flex-col lg:flex-row mg:flex-row'>
                      <Link href={`${route}/edit/${item.id}`}>
                        <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full items-center flex gap-2'>
                          <Edit size={24} />
                          Editar
                        </Button>
                      </Link>
                      <Button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full items-center flex gap-2'
                        onClick={() => handleDelete(item.id)}
                      >
                        <Delete size={24} />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </Accordion>)
}
