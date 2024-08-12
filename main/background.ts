import path from 'path';
import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';
import { OptionsTypesConvertEnum } from '@/shared/options-types-convert.enum';
const fs = require('fs').promises;

const exec = promisify(execCallback);

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('convert', async (event, arg) => {
  const body = JSON.parse(arg);

  try {
    const fileToConvertPath = path.join(process.cwd(), 'dtos', 'dto.cs');
    const pathParsed = path.parse(fileToConvertPath);

    if (body.typeToConvert == 'csharp-typescript') {
      await fs.mkdir(pathParsed.dir, { recursive: true });

      await fs.writeFile(fileToConvertPath, body.input, 'utf8');

      const executablePath = path.resolve(
        isProd ? 'resources/renderer/tools/dotnet-cs2ts.exe' : 'renderer/tools/dotnet-cs2ts.exe'
      );

      const { stdout, stderr } = await exec(`"${executablePath}"`, { timeout: 10000 });

      if (stderr) {
        throw new Error(stderr);
      }

      const tsFilePath = path.join(process.cwd(), 'dtos', 'dto.ts');

      if (await fileExists(tsFilePath)) {
        const resultado = await fs.readFile(tsFilePath, { encoding: 'utf8' });

        event.reply('convert', JSON.stringify({ output: resultado }));
      } else {
        throw new Error('Bad Request');
      }
    }

    if (body.typeToConvert == 'json-typescript') {
      const JsonToTS = require('json-to-ts');
      const interfaces = JsonToTS(JSON.parse(body.input), {
        rootName: 'RootInterface',
      });

      let interfacesFormated = interfaces.join('\n\n');
      console.log(interfacesFormated);

      event.reply('convert', JSON.stringify({ output: interfacesFormated }));
    }
  } catch (err) {
    console.error(err);
    event.reply('convert', 'houve um erro', err);
  }
});

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

ipcMain.on('message', async (event, arg) => {
  console.log(event, arg);

  const body = JSON.stringify(arg);

  event.reply('message', `${body}`);
});
