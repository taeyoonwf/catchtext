"use client"
import React, { useState } from 'react';
import TextareaAutoResize from './textareaAutoResize';
import useGenerateRandomColor from "./useGenerateRandomColor";

export default function Home() {
  const [readOnly, setReadOnly] = useState(false);
  const {color, generateColor} = useGenerateRandomColor();

    const changeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.currentTarget;
        console.log(value);
    }
  return (<>
    {readOnly ? 'readonly' : 'not readonly'}<br/>
    {color}
    <TextareaAutoResize
      className='test-class'
      value='Annyoung Annyoung Annyoung Annyoung Annyoung Annyoung Annyoung Annyoung Annyoung Annyoung Annyoung'
      onChange={changeText}
      readOnly={readOnly}
      backgroundColor={color}
    />
    <button onClick={() => {setReadOnly((prev) => !prev)}}>Read only</button>
    <button onClick={generateColor}>change bg color</button>
  </>);
}