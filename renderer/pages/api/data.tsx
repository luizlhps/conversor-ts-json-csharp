import path from 'path';
import fs from 'fs/promises';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execCallback);

export default async function handler(req, res) {
  try {
    const csFilePath = path.join(process.cwd(), 'dtos', 'dto.cs');
    const pathParsed = path.parse(csFilePath);

    await fs.writeFile(csFilePath, req.body, 'utf8');

    await fs.mkdir(pathParsed.dir, { recursive: true });

    const executablePath = path.resolve('renderer/tools/dotnet-cs2ts.exe');

    const { stdout, stderr } = await exec(`"${executablePath}"`, { timeout: 10000 });

    if (stderr) {
      console.error('stderr:', stderr);
      return res.status(500).json({ message: 'Erro ao converter o arquivo.' });
    }

    const tsFilePath = path.join(process.cwd(), 'dtos', 'dto.ts');

    if (await fileExists(tsFilePath)) {
      const resultado = await fs.readFile(tsFilePath, { encoding: 'utf8' });
      return res.status(200).json(resultado);
    } else {
      return res.status(400).json('Bad Request');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar o arquivo.' });
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}
