"use client"
import { useContext, useState } from 'react';
import { LanguageIdentifierContext } from '../language-identifier/languageIdentifier';
import { LanguageIdentifierResultType } from '../linguaWrapper';

export default function TestUnit() {
    const [text, setText] = useState("");
    // const [linguaReady, setLinguaReady] = useState(false);
    const [langIds, setLangIds] = useState<LanguageIdentifierResultType>();
    // const speechSynthesizer = useContext(SpeechSynthesizerContext);
    const languageIdentifier = useContext(LanguageIdentifierContext);
  
    const handleTextChange = (e: React.FormEvent<HTMLInputElement>) => {
      const { value } = e.currentTarget;
      setText(value);
      languageIdentifier.Query!(value, (langAndProb) => {
        console.log('get response');
        setLangIds(langAndProb);
      });
      console.log(languageIdentifier.Query);
  
      /* if (linguaReady) {
        workerRef.current?.postMessage({ init: false, text: value });
      }
      else {
        const langAll: {lang: string, accuracy: number}[] = detectAll(value);
        setLangIds(langAll.map((e, index) => ({language: e.lang, value: e.accuracy})));
      } */
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
  
    return (    <main className="flex min-h-screen flex-col items-center justify-between p-24">

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
    )
}
