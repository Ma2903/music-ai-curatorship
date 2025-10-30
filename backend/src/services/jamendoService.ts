// backend/src/services/jamendoService.ts
import axios, { AxiosError } from 'axios';
import 'dotenv/config';

const clientId = process.env.JAMENDO_CLIENT_ID;
const JAMENDO_API_BASE_URL = 'https://api.jamendo.com/v3.0';

// Interface para a resposta da busca de tracks do Jamendo
interface JamendoTrack {
    id: string;
    name: string;
    duration: number; // Duração em segundos
    artist_name: string;
    album_name: string;
    image: string; // URL da imagem (geralmente do álbum)
    audio: string; // <<< URL PARA STREAMING COMPLETO >>>
    audiodownload_allowed: boolean; // Informa se o download é permitido (não usaremos diretamente)
    // Outros campos úteis podem existir: license_ccurl, releasedate, etc.
}

interface JamendoSearchResponse {
    headers: {
        status: string;
        // ... outros cabeçalhos
    };
    results: JamendoTrack[];
}

// Função para buscar músicas no Jamendo
export const searchJamendoTracks = async (query: string, limit: number = 20) => {
    if (!clientId) {
        throw new Error('JAMENDO_CLIENT_ID não definido no .env');
    }

    const searchUrl = `${JAMENDO_API_BASE_URL}/tracks/`;

    try {
        const response = await axios.get<JamendoSearchResponse>(searchUrl, {
            params: {
                client_id: clientId,
                format: 'json', // Pede formato JSON
                limit: limit,
                search: query, // Termo de busca
                imagesize: 300, // Pede um tamanho razoável para a imagem (opcional)
                audioformat: 'mp32' // Pede o formato de áudio (mp3 quality 2 é comum)
            }
        });

        // Verifica se a resposta foi bem-sucedida no cabeçalho do Jamendo
        if (response.data.headers.status !== 'success') {
            console.error('Erro na resposta da API Jamendo:', response.data);
            throw new Error('API do Jamendo retornou um erro: ' + response.data.headers.status);
        }

        // Mapeia a resposta para um formato mais próximo do nosso tipo 'Song'
        const tracks = response.data.results.map((item: JamendoTrack) => {
             // Formata a duração de segundos para "m:ss"
             const minutes = Math.floor(item.duration / 60);
             const seconds = item.duration % 60;
             const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

             return {
                id: item.id, // ID do Jamendo (string)
                title: item.name,
                artist: item.artist_name,
                album: item.album_name,
                duration: formattedDuration, // Já formatado
                durationSeconds: item.duration, // Guarda segundos originais se precisar
                imageUrl: item.image, // URL da imagem
                // <<< USA A URL DE STREAMING COMPLETO >>>
                audioUrl: item.audio,
                // Jamendo não fornece previewUrl separado geralmente
                previewUrl: null, // Definimos como null
                // Pode adicionar um link para a página da música no Jamendo se quiser
                // spotifyUrl: `https://www.jamendo.com/track/${item.id}`, // Exemplo
                // Gênero e Mood não vêm diretamente na busca, precisaria de outra chamada ou inferência
                genre: null,
                mood: null,
             };
        });

        return tracks;

    } catch (error) {
        console.error('Erro ao buscar músicas no Jamendo:', error);
        let errorMessage = 'Falha ao buscar músicas no Jamendo.';
        if (axios.isAxiosError(error) && error.response?.data) {
            // Tenta pegar detalhes do erro da resposta, se houver
            errorMessage += ` Detalhes: ${JSON.stringify(error.response.data)}`;
        } else if (error instanceof Error) {
            errorMessage += ` Detalhes: ${error.message}`;
        }
        throw new Error(errorMessage);
    }
};