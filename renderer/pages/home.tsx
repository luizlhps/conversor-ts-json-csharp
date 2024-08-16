import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import { OptionsTypesConvertEnum } from '../shared/options-types-convert.enum';
import useConvert from '@/hooks/useConvert';
import { Header } from '@/components/ui/Header';

export default function HomePage() {
  const { data, error, loading, typeToConvert, handleConvertClick, handleTransform } = useConvert();

  return (
    <>
      <Header></Header>
      <div className='h-[calc(100vh-5rem)] mt-10 '>
        <div className='h-full py-8 '>
          <div className='flex justify-center gap-2 mb-8'>
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
    </>
  );
}
