// frontend/src/lib/utils.ts

/**
 * Formata milissegundos em uma string "minutos:segundos".
 * @param ms Duração em milissegundos.
 * @returns String formatada ou "--:--" se inválido.
 */
export const formatDuration = (ms: number | undefined | null): string => {
    if (ms === null || ms === undefined || ms <= 0) {
        return '--:--';
    }
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};