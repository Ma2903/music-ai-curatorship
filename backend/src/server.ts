// backend/src/server.ts
import 'dotenv/config'; // Carrega variáveis do .env
import app from './app';

const PORT = process.env.PORT || 3333; // Porta para o backend (diferente do frontend)

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});