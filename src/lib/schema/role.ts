import z from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres"),
  views: z.array(z.object({
    name: z.string(),
    create: z.boolean(),
    edit: z.boolean(),
    delete: z.boolean(),
    view: z.boolean(),
  })),
});
