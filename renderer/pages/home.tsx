import React, { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';

export default function HomePage() {
  const [state, setState] = useState();

  const useDebouse = (delay = 500) => {
    const isFirstTime = useRef(true);
    const DebouseDelay = useRef<NodeJS.Timeout>();

    const debouse = useCallback((func: () => void) => {
      if (isFirstTime.current) {
        isFirstTime.current = false;
        func();
      } else {
        if (DebouseDelay.current) {
          clearTimeout(DebouseDelay.current);
        }
        DebouseDelay.current = setTimeout(() => func(), delay);
      }
    }, []);
    return { debouse };
  };

  const { debouse } = useDebouse(300);

  const handleTransform = (value: string) => {
    debouse(async () => {
      fetch('/api/data', {
        method: 'POST',
        body: value,
      })
        .then((res) => res.json())
        .then((data) => setState(data));
    });
  };

  return (
    <div className='py-5'>
      <div className='flex justify-center gap-2'>
        <Button>Json - Typescript</Button>
        <Button>CSharp - Typscript</Button>
      </div>

      <div className='flex mt-2'>
        <Editor
          height='90vh'
          defaultLanguage='javascript'
          onChange={(val) => {
            handleTransform(val);
          }}
          defaultValue='// some comment'
        />
        <Editor height='90vh' defaultLanguage='javascript' value={state} defaultValue='// some comment' />
      </div>
    </div>
  );
}
