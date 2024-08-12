import path from 'path';
import fs from 'fs/promises';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';
import { NextApiRequest, NextApiResponse } from 'next';
import { OptionsTypesConvertEnum } from '../../shared/options-types-convert.enum';
import { ConvertedObjectDto } from '@/shared/_dto/convertedObjectDto';
import { ConvertObjectDto } from '@/shared/_dto/convertObjectDto';

const exec = promisify(execCallback);

export default async function handler(req: NextApiRequest, res: NextApiResponse<ConvertedObjectDto | ErrorResponse>) {
  if (req.method === 'POST') {
    try {
      const body = req.body as ConvertObjectDto;

      const fileToConvertPath = path.join(process.cwd(), 'dtos', 'dto.cs');
      const pathParsed = path.parse(fileToConvertPath);
      await fs.mkdir(pathParsed.dir, { recursive: true });

      await fs.writeFile(fileToConvertPath, body.input, 'utf8');

      if (body.typeToConvert == OptionsTypesConvertEnum.csharpToTypescript) {
        const executablePath = path.resolve('renderer/tools/dotnet-cs2ts.exe');

        const { stdout, stderr } = await exec(`"${executablePath}"`, { timeout: 10000 });

        if (stderr) {
          console.error('stderr:', stderr);
          return res.status(500).json({ message: 'Erro ao converter o arquivo.' });
        }

        const tsFilePath = path.join(process.cwd(), 'dtos', 'dto.ts');

        if (await fileExists(tsFilePath)) {
          const resultado = await fs.readFile(tsFilePath, { encoding: 'utf8' });

          const convertedObjectDto: ConvertedObjectDto = {
            output: resultado,
          };

          return res.status(200).json(convertedObjectDto);
        } else {
          return res.status(400).json({ message: 'Bad Request' });
        }
      }

      if (body.typeToConvert == OptionsTypesConvertEnum.jsonToTypescript) {
        const JsonToTS = (await import('json-to-ts')).default;
        const interfaces = JsonToTS(JSON.parse(body.input), {
          rootName: 'RootInterface',
        });

        let interfacesFormated = interfaces.join('\n\n');

        const convertedObjectDto: ConvertedObjectDto = {
          output: interfacesFormated,
        };

        res.status(200).json(convertedObjectDto);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao criar o arquivo.' });
    }
  } else {
    return res.status(500).json({ message: 'Erro kk ao criar o arquivo.' });
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
