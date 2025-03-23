import path from 'path';

// 🔹 Normaliza nombres eliminando caracteres no válidos
const processName = (name, replacer = '-') =>
  name
    .replace(/[?&=]/g, '') // Elimina caracteres problemáticos
    .match(/\w+/gi) // Extrae partes alfanuméricas
    .join(replacer); // Une con guiones

// 🔹 Convierte una URL en un nombre de archivo seguro (solo basename)
export const urlToFilename = (link, defaultFormat = '.html') => {
  const { name, ext } = path.parse(link); // ← quitamos el dir
  const format = ext || defaultFormat;
  return `${name}${format}`;
};

// 🔹 Convierte una URL en un nombre de directorio seguro
export const urlToDirname = (link, postfix = '_files') => {
  const { dir, name, ext } = path.parse(link);
  const slug = processName(path.join(dir, name, ext));
  return `${slug}${postfix}`;
};

// 🔹 Obtiene la extensión de un archivo
export const getExtension = (fileName) => path.extname(fileName);

// 🔹 Evita que `outputDirName` apunte a directorios restringidos
export const sanitizeOutputDir = (dir) => {
  const restrictedPaths = ['/sys', '/etc', '/bin', '/usr', '/lib'];
  if (restrictedPaths.includes(dir)) {
    throw new Error(`❌ No se puede usar el directorio restringido: ${dir}`);
  }
  return dir;
};
