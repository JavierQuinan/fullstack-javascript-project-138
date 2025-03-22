import path from 'path';
import { URL } from 'url';

export const getResourceFileName = (pageUrl, resourcePath) => {
  const { hostname } = new URL(pageUrl);
  const fullPath = path.join(hostname, resourcePath);
  return fullPath.replace(/[^a-zA-Z0-9]/g, '-');
};
