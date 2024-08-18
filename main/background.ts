import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';
const fs = require('fs').promises;

const exec = promisify(execCallback);

const isProd = process.env.NODE_ENV === 'production';

import { BaseError } from '../resources/exceptions/BaseError';

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
    backgroundColor: '#1e1e1e',
    titleBarStyle: 'hidden',
    roundedCorners: true,
    titleBarOverlay: {
      color: '#1e1e1e',
      symbolColor: '#9a9fa1',
      height: 10,
    },
    title: 'Conversor TS',
    icon: isProd ? 'resources/assets/icon.png' : 'assets/icon.png',
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

  console.log(new BaseError('O arquivo Ts não existe ', 404));

  event.reply('convert', JSON.stringify(new BaseError('O arquivo Ts não existe ', 404)));

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
        event.reply('convert', JSON.stringify(new BaseError('Houve um erro na execução do conversor Csharp', 500)));
      }

      const tsFilePath = path.join(process.cwd(), 'dtos', 'dto.ts');

      if (await fileExists(tsFilePath)) {
        const resultado = await fs.readFile(tsFilePath, { encoding: 'utf8' });

        event.reply('convert', JSON.stringify({ output: resultado }));

        fs.unlink(tsFilePath);
      } else {
        event.reply('convert', JSON.stringify(new BaseError('O arquivo Ts não existe ', 404)));
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
    event.reply('convert', JSON.stringify(new BaseError(`Houve um erro interno na hora da conversão`, 500)));
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
