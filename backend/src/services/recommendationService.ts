// backend/src/services/recommendationService.ts
import { PrismaClient, HistoryEntry } from '@prisma/client'; // Removido 'Song'
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { searchJamendoTracks } from './jamendoService';

// --- Tipos Locais ---

// <<< CORREÇÃO AQUI >>>
// Define a interface BackendRecommendation localmente
// Não estende mais o 'Song' do Prisma.
interface BackendRecommendation {
    id: string; // ID do Jamendo (string)
    title: string;
    artist: string;
    album: string;
    duration: string;
    genre: string | null;
    mood: string | null;
    imageUrl: string | null;
    audioUrl: string | null;
    justification: string;
}

// Tipo esperado da resposta parseada do Gemini
interface ParsedGeminiResponse {
    title: string;
    artist: string;
    justification: string;
}

// --- Configuração do Gemini ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY não definida no .env');
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// --- Função Principal ---
export const generateRecommendations = async (
    userId: number,
    historyLimit: number = 15,
    recommendationLimit: number = 5
): Promise<BackendRecommendation[]> => {

    console.log(`Gerando recomendações para userId: ${userId}`);

    // 1. Buscar Histórico Recente do Usuário (NÃO inclui mais 'song')
    const recentHistory = await prisma.historyEntry.findMany({
        where: { userId: userId },
        orderBy: { listenedAt: 'desc' },
        take: historyLimit,
        // include: { song: true }, // Relação removida
    });

    if (recentHistory.length === 0) {
        console.log("Histórico vazio, retornando recomendações genéricas (ou vazio).");
        // TODO: Retornar músicas populares genéricas do Jamendo
        return [];
    }

    // 2. Formatar o Histórico para o Prompt (Usa os campos salvos)
    // <<< CORREÇÃO AQUI >>>
    const historyPromptPart = recentHistory
        .map(entry => `- "${entry.songTitle}" por ${entry.songArtist} (Gênero: ${entry.songGenre ?? 'N/A'}, Mood: ${entry.songMood ?? 'N/A'})`)
        .join('\n');

    const prompt = `
        Você é um curador musical experiente. Baseado no seguinte histórico de músicas ouvidas recentemente por um usuário:
        ${historyPromptPart}

        Por favor, recomende ${recommendationLimit} novas músicas (diferentes das do histórico) que você acha que o usuário gostaria.
        Para cada recomendação, forneça:
        1. O nome exato da música.
        2. O nome exato do artista.
        3. Uma justificativa curta e envolvente explicando por que você a recomenda, conectando-a ao histórico do usuário.

        Formate cada recomendação estritamente como:
        Nome da Música - Nome do Artista :: Justificativa Curta Aqui
    `;

    console.log("--- Prompt enviado para o Gemini ---");
    console.log(prompt);
    console.log("-----------------------------------");


    // 3. Chamar a API do Gemini
    let geminiResponseText: string;
    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        geminiResponseText = response.text();
        console.log("--- Resposta crua do Gemini ---");
        console.log(geminiResponseText);
        console.log("-----------------------------");
    } catch (error) {
        console.error("Erro ao chamar API do Gemini:", error);
        throw new Error("Falha ao obter resposta da IA.");
    }

    // 4. Parsear a Resposta do Gemini
    const parsedRecommendations: ParsedGeminiResponse[] = [];
    const lines = geminiResponseText.split('\n');
    for (const line of lines) {
        if (line.includes(' - ') && line.includes(' :: ')) {
            const parts = line.split(' :: ');
            const titleArtistPart = parts[0];
            const justification = parts[1]?.trim() ?? "Recomendado pela IA.";

            const titleArtistSplit = titleArtistPart.split(' - ');
            const title = titleArtistSplit[0]?.trim();
            const artist = titleArtistSplit.slice(1).join(' - ').trim();

            if (title && artist) {
                parsedRecommendations.push({ title, artist, justification });
            }
        }
    }

    if (parsedRecommendations.length === 0) {
        console.warn("Não foi possível parsear nenhuma recomendação da resposta do Gemini.");
        return [];
    }

    console.log("Recomendações parseadas:", parsedRecommendations);

    // 5. Buscar Detalhes das Músicas Recomendadas no Jamendo
    const finalRecommendations: BackendRecommendation[] = [];
    for (const rec of parsedRecommendations) {
        try {
            const jamendoResults = await searchJamendoTracks(`${rec.title} ${rec.artist}`, 1);

            if (jamendoResults && jamendoResults.length > 0) {
                const track = jamendoResults[0];

                // <<< CORREÇÃO AQUI >>>
                // Atribui à interface BackendRecommendation local (id: string)
                const recommendation: BackendRecommendation = {
                    id: track.id, // track.id é string, BackendRecommendation.id é string
                    title: track.title,
                    artist: track.artist,
                    album: track.album,
                    duration: track.duration,
                    genre: null, // Gênero não vem da busca simples do Jamendo
                    mood: null,  // Mood não vem da busca simples do Jamendo
                    imageUrl: track.imageUrl,
                    audioUrl: track.audioUrl,
                    justification: rec.justification,
                };
                finalRecommendations.push(recommendation);
                console.log(`Encontrado no Jamendo: "${track.title}" por ${track.artist}`);
            } else {
                console.warn(`Não encontrado no Jamendo: "${rec.title}" por ${rec.artist}`);
            }
        } catch (error) {
            console.error(`Erro ao buscar "${rec.title}" no Jamendo:`, error);
        }
        if (finalRecommendations.length >= recommendationLimit) {
            break;
        }
    }

    console.log(`Retornando ${finalRecommendations.length} recomendações finais.`);
    return finalRecommendations;
};