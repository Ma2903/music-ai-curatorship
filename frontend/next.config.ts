/** @type {import('next').NextConfig} */
const nextConfig = {
  // Adicione a configuração de imagens aqui
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // O domínio que o Next.js está reclamando
        port: '',
        pathname: '/id/**', // Permite qualquer caminho depois de /id/
      },
    ],
  },
};

module.exports = nextConfig;