import { Title } from "@tremor/react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";

const views = [
  {
    name: 'Cadastro da Empresa',
  },
  {
    name: 'Perfis',
  },
  {
    name: 'AIs Configs ',
  },
  {
    name: 'Whatsapp Configs',
  },
]

export function TableCheckbox() {
  return (
    <Table className="w-full bg-slate-300">
      <TableHead className="w-full">
        <TableRow className='w-full'>
          <TableCell className='w-full'>
            Telas
          </TableCell>
          <TableCell className='w-2/12'>
            Create
          </TableCell>
          <TableCell className='w-2/12'>
            Edit
          </TableCell>
          <TableCell className='w-2/12'>
            Delete
          </TableCell>
          <TableCell className='w-2/12'>
            View
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {views.map((view, index) => (
          <TableRow key={view.name}>
            <TableCell>
              <Title className='text-sm'>{view.name}</Title>
            </TableCell>
            <TableCell>
              <Checkbox className='w-[25px] h-[25px]' />
            </TableCell>
            <TableCell>
              <Checkbox className='w-[25px] h-[25px]' />
            </TableCell>
            <TableCell>
              <Checkbox className='w-[25px] h-[25px]' />
            </TableCell>
            <TableCell>
              <Checkbox className='w-[25px] h-[25px]' />
            </TableCell>
          </TableRow>))}
      </TableBody>
    </Table>
  );
}