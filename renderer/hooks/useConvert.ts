import { ConvertedObjectDto } from '@/pages/shared/_dto/convertedObjectDto';
import { OptionsTypesConvertEnum } from '@/pages/shared/options-types-convert.enum';
import { useState } from 'react';
import useRequest from './useRequest';
import { ConveterObjectService } from '@/services/converterObjectService';
import { ConvertObjectDto } from '@/pages/shared/_dto/convertObjectDto';

const useConvert = () => {
  const [typeToConvert, setTypeToConvert] = useState({
    selected: OptionsTypesConvertEnum.csharpToTypescript,
  });

  const { data, error, loading, request } = useRequest<ConvertedObjectDto>();

  const handleTransform = (input: string) => {
    if (input.length < 4) return;

    const conveterObjectService = new ConveterObjectService();

    const convertObjectDto: ConvertObjectDto = {
      input,
      typeToConvert: typeToConvert.selected,
    };

    const fetchData = async () => await conveterObjectService.ConvertObject(convertObjectDto);
    request(fetchData);
  };

  const handleConvertClick = (optionsTypeConvert: OptionsTypesConvertEnum) => {
    setTypeToConvert((oldValue) => {
      return { selected: optionsTypeConvert };
    });
  };

  return {
    handleConvertClick,
    handleTransform,
    typeToConvert,
    data,
    error,
    loading,
  };
};

export default useConvert;
