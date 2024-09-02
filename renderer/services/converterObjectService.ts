//O motivo de ter 2 Exception Base é porque não é possível usar o exception do electron dentro do renderer
import { BaseError } from '@/exceptions/BaseError';
import { ConvertedObjectDto } from '@/shared/_dto/convertedObjectDto';
import { ConvertObjectDto } from '@/shared/_dto/convertObjectDto';

export class ConverterObjectService {
  public async ConvertObject(convertObjectDto: ConvertObjectDto): Promise<ConvertedObjectDto> {
    window.ipc.send('convert', JSON.stringify(convertObjectDto));

    return new Promise((resolve, reject) => {
      window.ipc.on('convert', (message: string | BaseError) => {
        if (typeof message === 'string') {
          const res = JSON.parse(message);

          if (res && res?.status && res?.status !== 200) {
            reject(new BaseError('Erro na conversão', res?.status));
            return;
          }

          return resolve(res);
        } else {
          reject(new BaseError('Erro Interno', 500));
        }
      });
    });
  }
}
