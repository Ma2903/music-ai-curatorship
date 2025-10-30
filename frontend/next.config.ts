// frontend/next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Domínios que já existiam
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/id/**',
      },
      // Domínio de imagens do Jamendo que já adicionamos
      {
        protocol: 'https',
        hostname: 'img.jamendo.com',
      },
      // --- ADICIONE ESTE BLOCO ---
      {
        protocol: 'https',
        hostname: 'usercontent.jamendo.com', // Autoriza o novo domínio
      },
      // --- FIM DA ADIÇÃO ---
    ],
  },
};

module.exports = nextConfig;