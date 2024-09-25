import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import { OptionsTypesConvertEnum } from '../shared/options-types-convert.enum';
import useConvert from '@/hooks/useConvert';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import refreshIcon from '../public/refresh.svg';
import { useEffect } from 'react';

export default function HomePage() {
  const { data, error, inputValue, loading, typeToConvert, handleConvertClick, handleTransform } = useConvert();

  return (
    <>
      <Header></Header>
      <div className='h-[calc(100vh-6rem)] mt-10 '>
        <div className='h-full py-8 '>
          <div className='flex justify-center gap-2 mb-8'>
            <Button
              variant={typeToConvert.selected === OptionsTypesConvertEnum.jsonToTypescript ? 'default' : 'outline'}
              onClick={() => handleConvertClick(OptionsTypesConvertEnum.jsonToTypescript)}
            >
              Json - Typescript
            </Button>
            <button onClick={() => handleTransform(inputValue)} className='ring-1 ring-primary solid p-2  rounded-md'>
              <Image src={refreshIcon} width={20} height={20} alt='Refresh'></Image>
            </button>
            <Button
              variant={typeToConvert.selected === OptionsTypesConvertEnum.csharpToTypescript ? 'default' : 'outline'}
              onClick={() => handleConvertClick(OptionsTypesConvertEnum.csharpToTypescript)}
            >
              CSharp - Typscript
            </Button>
          </div>

          <div className='flex h-full mt-2 flex-col md:flex-row overflow-auto'>
            <div className='h-full md:w-[50%] w-full'>
              <Editor
                options={{
                  automaticLayout: true,
                  autoIndent: 'full',
                }}
                height='100%'
                theme='vs-dark'
                language={typeToConvert.selected === OptionsTypesConvertEnum.jsonToTypescript ? 'json' : 'csharp'}
                defaultLanguage='csharp'
                onChange={(val) => {
                  handleTransform(val);
                }}
                defaultValue='// some comment'
              />
            </div>
            <div className='h-full md:w-[50%] w-full '>
              <Editor
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

      <Footer></Footer>
    </>
  );
}
