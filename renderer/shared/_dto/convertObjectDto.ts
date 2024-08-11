import { OptionsTypesConvertEnum } from '../options-types-convert.enum';

export class ConvertObjectDto {
  input: string; //json
  typeToConvert: OptionsTypesConvertEnum;
}
