'use client';
import React, { useEffect } from 'react';

// components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { Delete, Edit, Plus } from 'lucide-react';
import Link from 'next/link';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import axios from 'axios';
import { formatDate } from '@/lib/utils';
import AccordionDataTable from '@/components/data-tables/acordion-data-table';
import { AiVendas } from '@/app/(main)/(admin)/ai-venda/page';

type Props = {
  AiConfigs: AiVendas[];
};

export default function AiVendaView({ AiConfigs }: Props) {

  const [aiConfigs, setAiConfigs] = React.useState<AiVendas[]>(AiConfigs);

  useEffect(() => {
    updateData();
  }, []);

  const updateData = async () => {
    // update list
    const ret = await axios.get('/api/ai-venda');
    setAiConfigs(ret.data);
  }

  const handleDelete = async (id: string) => {
    // delete
    const form = new FormData();
    form.append('data', JSON.stringify({ id, action: 'delete' }));
    const ret = await axios.post(`/api/ai-venda`, form).then((e) => {
      if (e.status === 200) {
        // update list
        updateData();
      }
    });
  }
  return (
    <main className='px-[calc(8px+1rem)] lg:px-28 xl:px-32 max-h-[calc(100vh-100px)] flex flex-col'>
      <div className='flex 
      lg:flex-row 
      md:flex-row 
      flex-col 
      justify-between gap-4 text-center '>
        <h1 className='lg:text-4xl md:text-4xl font-bold text-2xl'>Vendedores</h1>
        <Link href='/ai-venda/register'>
          <Button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full items-center w-full'>
            <Plus size={24} />
            Criar
          </Button>
        </Link>
      </div>
      <div className='rounded-2xl mt-4 drop-shadow-lg'>
        <AccordionDataTable route='/ai-venda' data={aiConfigs.map((e) => {
          return {
            ...e,
            created_at: formatDate(e.created_at),
            updated_at: formatDate(e.updated_at),
            qtd_produtos: e.produtos.length
          }
        })} handleDelete={handleDelete}
          viewValue={[
            { id: 'created_at', label: 'Criado em: ' },
            { id: 'updated_at', label: 'Atualizado em: ' },
            { id: 'model', label: 'Modelo: ' },
            { id: 'max_tokens', label: 'Max Tokens: ' },
            { id: 'frequency_penalty', label: 'Frequencia: ' },
            { id: 'presence_penalty', label: 'Presença: ' },
            { id: 'temperature', label: 'Temperatura: ' },
            { id: 'top_p', label: 'Qualidade: ' },
            { id: 'stop', label: 'Black List: ' },
            { id: 'qtd_produtos', label: 'Qtd Produtos: ' },
          ]}
        />
      </div>
    </main >
  );
}

