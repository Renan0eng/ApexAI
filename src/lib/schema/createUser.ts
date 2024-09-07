import z from "zod";

export const createUser = z.object({
  id: z.string().optional(),
  company_id: z.string().uuid("ID da empresa inválido"),
  role_id: z.string().uuid("ID da função inválido"),
  username: z
    .string()
    .min(3, "Nome de usuário deve ter no mínimo 3 caracteres")
    .max(255, "Nome de usuário deve ter no máximo 255 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().refine(
    (value: string) => {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[@$!%*#?&]/.test(value);

      return (
        value.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
      );
    },
    {
      message:
        "A senha deve ter pelo menos 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
    }
  ),
  confirmPassword: z.string().refine((value: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[@$!%*#?&]/.test(value);

    return (
      value.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  }),
});
