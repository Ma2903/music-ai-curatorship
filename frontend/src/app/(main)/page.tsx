// frontend/src/app/(main)/page.tsx

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Bem-vindo ao Music AI Curatorship
      </h1>
      <p className="text-neutral-400">
        Esta é a área de Conteúdo Principal. Em breve, ela será preenchida 
        com suas recomendações de música geradas pela IA do Gemini.
      </p>

      {/* Box de teste para ver o fundo escuro (se o Tailwind estiver funcionando) */}
      <div className="h-64 w-full bg-neutral-800 p-4 rounded-lg mt-8 text-neutral-300">
        Box de Teste
      </div>
    </div>
  );
}