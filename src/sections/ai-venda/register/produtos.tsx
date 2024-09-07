import { InputLabel } from "@/components/inputs/imput-label";
import SwitchLabel from "@/components/inputs/switch-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormSetValue, UseFormWatch, useForm } from "react-hook-form";
import { z } from "zod";
import { InputsAiConfig } from "./ai-venda-register-view";

type Props = {
  setVal: UseFormSetValue<InputsAiConfig>;
  wat: UseFormWatch<InputsAiConfig>;
  produto: boolean;
  setProduto: any;
};

type InputsProdutos = {
  name: string;
  price: number;
  description: string;
  link: string;
  group: string;
};

export default function Produtos({ setVal, wat, produto, setProduto }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InputsProdutos>({
    resolver: zodResolver(
      z.object({
        name: z
          .string()
          .min(3, { message: "Nome deve ter no mínimo 3 caracteres." }),
        price: z.number().min(0, { message: "Preço deve ser maior que 0." }),
        description: z
          .string()
          .min(3, { message: "Nome deve ter no mínimo 3 caracteres." }),
        link: z
          .string()
          .min(3, { message: "Nome deve ter no mínimo 3 caracteres." }),
        group: z
          .string()
          .min(3, { message: "Nome deve ter no mínimo 3 caracteres." }),
      })
    ),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      link: "",
      group: "",
    },
  });

  const onSubmit = async (data: InputsProdutos) => {
    console.log(data);
    setVal("produto", [...wat("produto"), data]);
    reset();
  };

  return (
    <div className="flex flex-col gap-4">
      <SwitchLabel
        label="Produtos"
        value={produto}
        onChange={(e) => {
          setProduto(e);
        }}
      />
      <div style={{ display: produto ? "grid" : "none" }} className="gap-16">
        <FormProduto
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          onSubmit={onSubmit}
        />
        {/* Table */}
        <TableProdutos
          wat={wat}
          data={wat("produto")}
          handleEditar={(e) => {
            setValue("name", e.name);
            setValue("price", e.price);
            setValue("description", e.description);
            setValue("link", e.link);
            setValue("group", e.group);
            setVal(
              "produto",
              wat("produto").filter((a: any) => a.name !== e.name)
            );
          }}
          handleDelete={(id) => {
            setVal(
              "produto",
              wat("produto").filter((e: any) => e.name !== id)
            );
          }}
        />
      </div>
    </div>
  );
}

type PropsTable = {
  data: InputsProdutos[];
  handleDelete: (id: string) => void;
  handleEditar: ({
    name,
    price,
    description,
    link,
    group,
  }: {
    name: string;
    price: number;
    description: string;
    link: string;
    group: string;
  }) => void;
  wat: UseFormWatch<InputsAiConfig>;
};

function TableProdutos({ data, handleDelete, wat, handleEditar }: PropsTable) {
  return (
    <div className="rounded-lg overflow-hidden border-input border-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Grupo</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((e) => (
            <TableRow key={e.name}>
              <TableCell title={e.name}>{e.name}</TableCell>
              <TableCell title={`R$${e.price}`}>R${e.price}</TableCell>
              {/* quando passar por cima quero que apareça todo o texto */}
              <TableCell title={e.description}>{e.description.length > 20 ? e.description.substring(0, 20) + "..." : e.description}</TableCell>
              <TableCell title={e.link}>{e.link.length > 20 ? e.link.substring(0, 20) + "..." : e.link}</TableCell>
              <TableCell title={e.group}>{e.group}</TableCell>
              <TableCell className="flex flow-row gap-2">
                <Button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full items-center w-full"
                  onClick={() => handleDelete(e.name)}
                >
                  Deletar
                </Button>
                <Button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full items-center w-full"
                  onClick={() => handleEditar(e)}
                >
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-primary-700">
          <TableRow>
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">
              {wat("produto").length} Produtos
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

type FormProps = {
  register: UseFormRegister<InputsProdutos>;
  handleSubmit: UseFormHandleSubmit<InputsProdutos, undefined>;
  errors: FieldErrors<InputsProdutos>;
  onSubmit: (data: InputsProdutos) => Promise<void>;
};

function FormProduto({ register, handleSubmit, errors, onSubmit }: FormProps) {
  return (
    <div
      className="flex flex-col lg:gap-x-16 xl:gap-x-32 md:gap-x-8
  gap-y-2"
    >
      <div
        className="
  grid md:grid-cols-2 sm:grid-cols-1
  lg:gap-x-16 xl:gap-x-32 md:gap-x-8
  gap-y-2"
      >
        <InputLabel label="Nome Produto" description="Nome do produto.">
          <Input {...register("name")} />
          {/* errors will return when field validation fails  */}
          {errors.name && (
            <span className="text-danger-500">{errors.name.message}</span>
          )}
        </InputLabel>
        <InputLabel label="Preço" description="Preço do produto.">
          <Input
            type="number"
            {...register("price", { valueAsNumber: true })}
          />
          {/* errors will return when field validation fails  */}
          {errors.price && (
            <span className="text-danger-500">{errors.price.message}</span>
          )}
        </InputLabel>
        <InputLabel label="Link" description="Link do produto.">
          <Input {...register("link")} />
          {/* errors will return when field validation fails  */}
          {errors.link && (
            <span className="text-danger-500">{errors.link.message}</span>
          )}
        </InputLabel>
        <InputLabel label="Grupo" description="Grupo do produto.">
          <Input {...register("group")} />
          {/* errors will return when field validation fails  */}
          {errors.group && (
            <span className="text-danger-500">{errors.group.message}</span>
          )}
        </InputLabel>
      </div>
      <div>
        <InputLabel label="Descrição" description="Descrição do produto.">
          <Textarea {...register("description")} />
          {/* errors will return when field validation fails  */}
          {errors.description && (
            <span className="text-danger-500">
              {errors.description.message}
            </span>
          )}
        </InputLabel>
      </div>
      <div
        className="
  grid md:grid-cols-2 sm:grid-cols-1
  lg:gap-x-16 xl:gap-x-32 md:gap-x-8
  gap-y-8"
      >
        <div />
        <Button
          className="bg-green-500 hover:bg-green-700 text-white font-bold w-full"
          onClick={handleSubmit(onSubmit)}
        >
          Adicionar Produto
        </Button>
      </div>
    </div>
  );
}
