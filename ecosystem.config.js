module.exports = {
  apps: [
    {
      name: 'apexai', // Nome do aplicativo
      script: 'npm', // Comando para iniciar o Next.js
      args: 'start', // Argumento para iniciar o Next.js
      cwd: './', // Diretório de trabalho
      env: {
        NODE_ENV: 'production', // Ambiente de produção
        DATABASE_URL: 'mysql://root:R3n@n159753@92.112.176.194:3306/apexai', // URL do banco de dados
        SECRET_WEBHOOK_KEY: "segredo123",
        OPENAI_API_KEY: "sk-uqFe7Ki9aLH9eiFGpR2f33Z4KQ2SQEoMy56qsiW5ujT3BlbkFJ1Sgjs3sdNwitKBZI9nz-wEWz-USkgyaGrage4wfFYA"
      },
    },
  ],
};
