// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// Middlewares essenciais
app.use(cors());

// --- ADICIONE ESTE MIDDLEWARE DE DEBUG ---
app.use((req, res, next) => {
  console.log('--- Nova Requisição ---');
  console.log('Método:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Cabeçalhos:', req.headers);

  // Tenta logar o corpo cru ANTES do express.json processar
  // Isso pode ou não funcionar dependendo de como o stream é tratado
  let rawBody = '';
  req.on('data', chunk => {
    rawBody += chunk.toString();
  });
  req.on('end', () => {
    console.log('Corpo Cru (se capturado):', rawBody);
    // Coloca o corpo cru de volta no stream para o próximo middleware (express.json)
    // Isso é um HACK para debug e pode não ser 100% confiável
    (req as any).rawBody = rawBody; // Guarda para referência
  });

  next(); // Continua para o próximo middleware (express.json)
});
// --- FIM DO MIDDLEWARE DE DEBUG ---

app.use(express.json()); // Habilita o parsing de JSON

// Rotas da API
app.use('/api', routes);

// Tratamento básico de erros
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('--- Erro Capturado ---');
  console.error(err.stack);
  // Log adicional para ver o corpo que causou o erro no parser
  if ((err as any).body) {
    console.error('Corpo que causou o erro:', (err as any).body);
  } else if ((req as any).rawBody) {
     console.error('Corpo cru recebido (antes do erro):', (req as any).rawBody);
  }
  res.status(500).json({ error: 'Internal Server Error', details: err.message }); // Adiciona detalhes do erro
});

export default app;