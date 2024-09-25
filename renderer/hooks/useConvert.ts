import { OptionsTypesConvertEnum } from '@/shared/options-types-convert.enum';
import { useEffect, useState } from 'react';
import useRequest from './useRequest';
import { ConverterObjectService } from '@/services/converterObjectService';
import { ConvertedObjectDto } from '@/shared/_dto/convertedObjectDto';
import { ConvertObjectDto } from '@/shared/_dto/convertObjectDto';

const useConvert = () => {
  const [typeToConvert, setTypeToConvert] = useState({
    selected: OptionsTypesConvertEnum.csharpToTypescript,
  });

  const [inputValue, setInputValue] = useState<string>(null);

  const { data, error, loading, request } = useRequest<ConvertedObjectDto>();

  const handleTransform = async (input: string) => {
    if (input.length < 4) return;

    const converterObjectService = new ConverterObjectService();

    const convertObjectDto: ConvertObjectDto = {
      input,
      typeToConvert: typeToConvert.selected,
    };

    //setar valor para poder fazer refresh
    setInputValue((oldvalue: string) => {
      return input;
    });

    const fetchData = async () => await converterObjectService.ConvertObject(convertObjectDto);
    request(fetchData);
  };

  const handleConvertClick = (optionsTypeConvert: OptionsTypesConvertEnum) => {
    setTypeToConvert((oldValue) => {
      return { selected: optionsTypeConvert };
    });
  };

  return {
    inputValue,
    handleConvertClick,
    handleTransform,
    typeToConvert,
    data,
    error,
    loading,
  };
};

export default useConvert;
