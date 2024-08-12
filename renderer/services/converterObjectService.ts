import { ConvertedObjectDto } from '@/shared/_dto/convertedObjectDto';
import { ConvertObjectDto } from '@/shared/_dto/convertObjectDto';
import { OptionsTypesConvertEnum } from '@/shared/options-types-convert.enum';
import { ipcRenderer } from 'electron';
export class ConveterObjectService {
  public async ConvertObject(convertObjectDto: ConvertObjectDto): Promise<ConvertedObjectDto> {
    try {
      window.ipc.send('convert', JSON.stringify(convertObjectDto));
      return new Promise((resolve, reject) => {
        window.ipc.on('convert', (message: string) => {
          console.log(message);
          resolve(JSON.parse(message));
        });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
