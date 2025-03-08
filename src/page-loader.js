import axios from "axios";
import { promises as fs } from "fs";
import path from "path";
import url from "url";

const pageLoader = async (websiteUrl, outputDir = process.cwd()) => {
  const parsedUrl = new URL(websiteUrl);
  const filename = `${parsedUrl.hostname.replace(/\W/g, "-")}${parsedUrl.pathname.replace(/\W/g, "-")}.html`;
  const filePath = path.join(outputDir, filename);

  try {
    const response = await axios.get(websiteUrl);
    await fs.writeFile(filePath, response.data);
    return filePath;
  } catch (error) {
    throw new Error(`Error al descargar la página: ${error.message}`);
  }
};

export default pageLoader;
