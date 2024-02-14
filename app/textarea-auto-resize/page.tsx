"use client"
import React from 'react';
import TextareaAutoResize from './textareaAutoResize';

export default function Home() {
    const changeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.currentTarget;
        console.log(value);
    }
  return (<>
    <TextareaAutoResize className='test-class' value='Annyoung Annyoung Annyoung Annyoung Annyoung Annyoung Annyoung Annyoung Annyoung Annyoung Annyoung' onChange={changeText} />
  </>);
}