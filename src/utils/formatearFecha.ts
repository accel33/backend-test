export function formatearFecha(timestamp: string) {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'America/Lima',
    timeZoneName: 'short',
  });
  return formattedDate;
}
