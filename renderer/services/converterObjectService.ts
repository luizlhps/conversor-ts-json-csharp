import { ConvertedObjectDto } from '@/shared/_dto/convertedObjectDto';
import { ConvertObjectDto } from '@/shared/_dto/convertObjectDto';
import { OptionsTypesConvertEnum } from '@/shared/options-types-convert.enum';

export class ConveterObjectService {
  public async ConvertObject(convertObjectDto: ConvertObjectDto): Promise<ConvertedObjectDto> {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convertObjectDto),
      });

      if (response.status !== 200) {
        throw new Error('Ocorreu um erro na conversão ' + response.status);
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
