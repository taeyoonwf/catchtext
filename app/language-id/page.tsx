"use client"
import React, { useState, useEffect, useRef } from "react";
import { detectAll } from 'tinyld/heavy'
import { LanguageIdentifierOutputType } from "../linguaWrapper";

export default function Home() {
  const [text, setText] = useState("");
  const [linguaReady, setLinguaReady] = useState(false);
  const [langIds, setLangIds] = useState<{language: string, value: number}[]>();
  const workerRef = useRef<Worker>()

  useEffect(() => {
    workerRef.current = new Worker(new URL('../linguaWrapper.ts', import.meta.url));
    workerRef.current.onmessage = async (event: MessageEvent<boolean|LanguageIdentifierOutputType>) => {
      if (typeof event.data === "boolean")
        setLinguaReady(true);
      else
        setLangIds(event.data.result);
    }
    workerRef.current?.postMessage({ init: true, text: '' });

    return () => {
      workerRef.current?.terminate()
    }
  }, []);

  const handleTextChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setText(value);
    if (linguaReady) {
      workerRef.current?.postMessage({ init: false, text: value });
    }
    else {
      const langAll: {lang: string, accuracy: number}[] = detectAll(value);
      setLangIds(langAll.map((e, index) => ({language: e.lang, value: e.accuracy})));
    }
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
        style={{color: "black"}}
        type="text"
        value={text}
        size={30}
        onChange={handleTextChange}
      />
      </form>
      <div>
        {showLangIds()}
      </div>
    </main>
  );
}