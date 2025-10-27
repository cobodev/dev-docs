export const sanitizeFileName = (name: string): string => {
  return name
    .toLowerCase()                          // todo en minúsculas
    .normalize('NFD')                       // separa acentos de las letras
    .replace(/[\u0300-\u036f]/g, '')        // elimina acentos
    .replace(/[^a-z0-9\s_-]/g, '')          // elimina caracteres no válidos
    .trim()                                 // elimina espacios al inicio/fin
    .replace(/\s+/g, '-')                   // espacios → guiones bajos
    .replace(/_+/g, '-'); 
}