import z from "zod";

export const createAiVendaSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres"),
  sistema: z.array(
    z.object({
      id: z.string(),
      quest: z.string(),
      response: z.string(),
    })
  ),
  max_tokens: z.number().optional(),
  model: z.string().optional(),
  temperature: z.number().optional(),
  stop: z.string().optional(),
  top_p: z.number().optional(),
  frequency_penalty: z.number().optional(),
  presence_penalty: z.number().optional(),
  faq: z.array(
    z.object({
      id: z.string(),
      quest: z.string(),
      response: z.string().or(
        z.instanceof(File).refine((file) => {
          return file.size < 1000000 * 5;
        }, "O arquivo deve ter no máximo 5MB")
      ),
    })
  ),
  produto: z.array(
    z.object({
      name: z.string(),
      price: z.number(),
      description: z.string(),
      link: z.string(),
      group: z.string(),
    })
  ),
  file: z.array(
    z
      .instanceof(File)
      .refine((file) => {
        return file.size < 1000000 * 5;
      }, "O arquivo deve ter no máximo 5MB")
      .optional()
      .or(
        z
          .object({
            id: z.string(),
            ai_config_id: z.string(),
            name: z.string(),
            url: z.string(),
            updated_at: z.string(),
            created_at: z.string(),
          })
          .optional()
      )
  ),
});
