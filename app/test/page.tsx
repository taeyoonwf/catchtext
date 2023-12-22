"use client"
import React, { useState, useEffect, useRef } from "react";
import { detectAll } from 'tinyld/heavy'

export default function Home() {
  const [text, setText] = useState("");
  const [langIds, setLangIds] = useState<{language: string, value: number}[]>();

  const handleTextChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setText(value);
    const langAll: {lang: string, accuracy: number}[] = detectAll(value);
    setLangIds(langAll.map((e, index) => ({language: e.lang, value: e.accuracy})));
  };

  const handleSubmit = () => {}

  const showLangIds = () => {
    if (langIds) {
      return (<>
        {langIds.map((value, index) => (
          <div key={index}>{value.language} : {value.value}</div>
        ))}
      </>);
    }

    return (<div></div>);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        size={50}
        onChange={handleTextChange}
      />
      </form>
      <div>
        {showLangIds()}
      </div>
    </main>
  );
}