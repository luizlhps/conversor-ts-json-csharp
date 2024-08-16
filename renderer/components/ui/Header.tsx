import React from 'react';

export const Header = () => {
  return (
    <div
      className='h-8 fixed w-full top-0 left-0 border-b border-[#3f4053]'
      style={
        {
          WebkitAppRegion: 'drag',
        } as React.CSSProperties
      }
    ></div>
  );
};
