import { z } from "zod";

export const createWhatsappClientSchema = z.object({
  name: z.string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres"),
  configId: z.string()
})
