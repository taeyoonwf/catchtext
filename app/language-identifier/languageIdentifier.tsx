"use client"
import React, { createContext, useEffect, useRef } from "react";
import { LanguageIdentifierInputType, LanguageIdentifierOutputType, LanguageIdentifierResultType } from "../linguaWrapper";
import { detectAll } from 'tinyld/heavy'

type ResponseCallbackFunc = (langAndProb: LanguageIdentifierResultType) => void;

interface LanguageIdentifierContextType {
  Query?: (text: string, ResponseCallback: ResponseCallbackFunc) => void;
}

const LanguageIdentifierContext = createContext<LanguageIdentifierContextType>({});

function LanguageIdentifier({
  children,
}: {
  children: React.ReactNode
}) {
  let linguaReady = false;
  const workerRef = useRef<Worker>();
  const queue: ResponseCallbackFunc[] = [];

  useEffect(() => {
    console.log(`language identifier useEffect!`);
    if (workerRef.current === undefined) {
        workerRef.current = new Worker(new URL('../linguaWrapper.ts', import.meta.url));
        //workerRef = new Worker(new URL('../linguaWrapper.ts', import.meta.url));
        workerRef.current.onmessage = async (event: MessageEvent<boolean|LanguageIdentifierOutputType>) => {
        console.log('here0');
        const data = await event.data;
        console.log(data);
        if (typeof data === "boolean")
          //setLinguaReady(true);
          linguaReady = true;
        else {
          queue[data.id]?.call(null, data.result);
        }
        //setLangIds(event.data);
      }
      console.log('workerRef! post0');
      // const initMsg: LanguageIdentifierInputType = { init: true, text: '', id: -1 };
      // workerRef.postMessage(initMsg);
      workerRef.current?.postMessage({ init: true, text: '' });
      console.log('workerRef! post1');
    }

    return () => {
        //console.log('workerRef terminate');
      //workerRef.current?.terminate()
    }
  }, []);

  const Query = (text: string, ResponseCallback: ResponseCallbackFunc) => {
    if (linguaReady) {
      const index = queue.length;
      queue.push(ResponseCallback);
      console.log(`index : ${index}`);
      console.log(ResponseCallback);
      // SetQueue((prev) => [...prev, ResponseCallback]);
      workerRef.current?.postMessage({ init: false, text, id: index });
    }
    else {
      const langAll: {lang: string, accuracy: number}[] = detectAll(text);
      ResponseCallback?.call(null, langAll.map((e, index) => ({language: e.lang, value: e.accuracy})));
      // setLangIds(langAll.map((e, index) => ({language: e.lang, value: e.accuracy})));
    }
  }

  return (
    <LanguageIdentifierContext.Provider value={{ Query }}>
      {children}
    </LanguageIdentifierContext.Provider>
  );
}

export { LanguageIdentifier, LanguageIdentifierContext };