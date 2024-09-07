import z from "zod";

export const createCompanyConfigSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres"),
  razao_social: z
    .string()
    .min(3, "Razão Social deve ter no mínimo 3 caracteres")
    .max(255, "Razão Social deve ter no máximo 255 caracteres"),
  cnpj: z
    .string()
    .min(14, "CNPJ deve ter no mínimo 14 caracteres")
    .max(14, "CNPJ deve ter no máximo 14 caracteres"),
  inscricao_estadual: z
    .string()
    .min(3, "Inscrição Estadual deve ter no mínimo 3 caracteres")
    .max(255, "Inscrição Estadual deve ter no máximo 255 caracteres"),
    area_atividade: z
    .string()
    .min(3, "Área de Atuação deve ter no mínimo 3 caracteres")
    .max(255, "Área de Atuação deve ter no máximo 255 caracteres"),
    categoria_empresa: z
    .string()
    .min(3, "Categoria deve ter no mínimo 3 caracteres")
    .max(255, "Categoria deve ter no máximo 255 caracteres"),
  descricao: z
    .string()
    .min(3, "Descrição deve ter no mínimo 3 caracteres")
    .max(255, "Descrição deve ter no máximo 255 caracteres"),
  endereco: z
    .object({
      id: z.string().optional(),
      cep: z.string().min(8, "CEP deve ter no mínimo 8 caracteres").max(8, "CEP deve ter no máximo 8 caracteres"),
      cidade: z.string().min(3, "Cidade deve ter no mínimo 3 caracteres").max(255, "Cidade deve ter no máximo 255 caracteres"),
      estado: z.string().min(2, "Estado deve ter no mínimo 2 caracteres").max(2, "Estado deve ter no máximo 2 caracteres"),
      rua: z.string().min(3, "Rua deve ter no mínimo 3 caracteres").max(255, "Rua deve ter no máximo 255 caracteres"),
      numero: z.string().min(1, "Número deve ter no mínimo 1 caracteres").max(255, "Número deve ter no máximo 255 caracteres"),
    }),
});
