module.exports = {
  apps: [
    {
      name: 'apexai', // Nome do aplicativo
      script: 'npm', // Comando para iniciar o Next.js
      args: 'start', // Argumento para iniciar o Next.js
      cwd: './', // Diretório de trabalho
      env: {
        NODE_ENV: 'production', // Ambiente de produção
        DATABASE_URL: 'mysql://root:root@mysql:3306/apexai', // URL do banco de dados
      },
    },
  ],
};
