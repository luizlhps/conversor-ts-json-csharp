import { useState } from 'react';

import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import { OptionsTypesConvertEnum } from './shared/options-types-convert.enum';
import { ConvertedObjectDto } from './shared/_dto/convertedObjectDto';
import { ConvertObjectDto } from './shared/_dto/convertObjectDto';
import { useDebouse } from '../hooks/useDebouse';
import { ConveterObjectService } from '../services/converterObjectService';
import useRequest from '@/hooks/usePostConvert';

export default function HomePage() {
  const [typeToConvert, setTypeToConvert] = useState({
    selected: OptionsTypesConvertEnum.csharpToTypescript,
  });

  const { data, error, loading, request } = useRequest<ConvertedObjectDto>();

  const handleTransform = (input: string) => {
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

  console.log(data);

  return (
    <div className='h-[calc(100vh-2rem)]'>
      <div className='h-full py-8'>
        <div className='flex justify-center gap-2 mb-4'>
          <Button
            variant={typeToConvert.selected === OptionsTypesConvertEnum.jsonToTypescript ? 'default' : 'outline'}
            onClick={() => handleConvertClick(OptionsTypesConvertEnum.jsonToTypescript)}
          >
            Json - Typescript
          </Button>
          <Button
            variant={typeToConvert.selected === OptionsTypesConvertEnum.csharpToTypescript ? 'default' : 'outline'}
            onClick={() => handleConvertClick(OptionsTypesConvertEnum.csharpToTypescript)}
          >
            CSharp - Typscript
          </Button>
        </div>

        <div className='flex h-full mt-2 sm:flex-row '>
          <div className='h-full w-[50%]'>
            <Editor
              onMount={this?.editorDidMount}
              options={{
                automaticLayout: true,
              }}
              height='100%'
              theme='vs-dark'
              defaultLanguage='csharp'
              onChange={(val) => {
                handleTransform(val);
              }}
              defaultValue='// some comment'
            />
          </div>
          <div className='h-full w-[50%]'>
            <Editor
              onMount={this?.editorDidMount}
              theme='vs-dark'
              height='100%'
              defaultLanguage='typescript'
              value={data?.output}
              defaultValue='// some comment'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
