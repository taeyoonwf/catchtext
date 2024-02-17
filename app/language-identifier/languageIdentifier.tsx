"use client"
import React, { createContext, useEffect, useRef } from "react";
import { LanguageIdentifierOutputType, LanguageIdentifierResultType } from "../linguaWrapper";
import { detectAll } from 'tinyld/heavy'

const langNameToId: {[key in string]: string} = {
  French : "fr",
  English : "en",
  Portuguese : "pt",
  Italian : "it",
  Indonesian : "id",
  Dutch : "nl",
  Spanish : "es",
  German : "de",
  Polish : "pl",
  Chinese : "zh",
  Hindi : "hi",
  Japanese : "ja",
  Korean : "ko",
  Russian : "ru",
};

type ResponseCallbackFunc = (langAndProbs: LanguageIdentifierResultType) => void;

interface LanguageIdentifierContextType {
  Query?: (text: string, ResponseCallback: ResponseCallbackFunc) => void;
}

const LanguageIdentifierContext = createContext<LanguageIdentifierContextType>({});
let linguaReady = false;
const queue: ResponseCallbackFunc[] = [];

function LanguageIdentifier({
  children,
}: {
  children: React.ReactNode
}) {
  const workerRef = useRef<Worker>();

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
          console.log(`index : ${data.id}`);
          console.log(`queue size : ${queue.length}`);
          data.result = data.result.map((e) => ({
            language: langNameToId[e.language],
            value: e.value
          }))
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
      console.log(`index : ${index}, text : ${text}`);
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