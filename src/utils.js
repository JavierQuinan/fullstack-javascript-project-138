import path from 'path';

// 🔹 Normaliza nombres eliminando caracteres no válidos
const processName = (name, replacer = '-') => name
  .replace(/[^a-zA-Z0-9]/g, replacer)  // Simplificado para cualquier carácter no alfanumérico
  .replace(/-+/g, replacer)            // Elimina guiones consecutivos
  .replace(/^-|-$/g, '');              // Elimina guiones al inicio/final

// 🔹 Convierte una URL en un nombre de archivo seguro
export const urlToFilename = (urlPath, defaultFormat = '') => {
  // Extrae solo el pathname (sin hostname)
  const cleanedPath = urlPath
    .replace(/^\//, '')                 // Elimina la barra inicial
    .replace(/\//g, '-');               // Reemplaza barras por guiones

  const { name, ext } = path.parse(cleanedPath);
  const slug = processName(name);
  const format = ext || defaultFormat;

  return `${slug}${format}`;
};

// 🔹 Convierte una URL en un nombre de directorio seguro
export const urlToDirname = (link, postfix = '_files') => {
  const { name } = path.parse(link);
  const slug = processName(name);
  
  return `${slug}${postfix}`;
};

// 🔹 Obtiene la extensión de un archivo
export const getExtension = (fileName) => path.extname(fileName);

// 🔹 Evita que `outputDirName` apunte a directorios restringidos
export const sanitizeOutputDir = (dir) => {
  const restrictedPaths = ['/sys', '/etc', '/bin', '/usr', '/lib'];
  if (restrictedPaths.includes(dir)) {
    throw new Error(`No se puede usar el directorio restringido: ${dir}`);
  }
  return dir;
};
