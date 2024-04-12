"use client"
import { ChangeEvent, useEffect, useState } from 'react';
import './layout.css';
import { BlankType, LangIdType } from '@/app/baseTypes';

export interface TextTemplateProps {
  langId?: LangIdType|BlankType;
  onChange?: (value: string) => void;
}

const ears = "👂👂🏻👂🏼👂🏽👂🏾👂🏿";
const earsIndice = [0, 2, 6, 10, 14, 18, 22];
const getRandomInt = (max: number) => Math.floor(Math.random() * max);
const anyEar = () => {
  const idx = getRandomInt(earsIndice.length - 1);
  return ears.substring(earsIndice[idx], earsIndice[idx + 1]);
};
//const randomEar = anyEar();

const templatesNormal = [
  {label: "Normal", value: "normal"},
  {label: "$ear Test (Dialog 1P)", value: "listeningTestDialog1P"},
];

const templatesDialog2P = [
  {label: "$ear Test (Dialog F/M)", value: "listeningTestDialogFM"},
  {label: "$ear Test (Dialog M/F)", value: "listeningTestDialogMF"},
];

const description: {[key: string]: string} = {
  "listeningTestDialog1P": "... ... \n  ... ... \n  ...\n  .\n  .\n  \n  1. ...?\n  (A) ... (B) ... (C) ... \n  Answer : C \n  \n  2. ...?\n  (A) ... \n  (B) ... \n  .\n  .\n  Answer : A \n  \n  3. ...?\n  Answer : ...\n  ",
};

export default function TextTemplates({
  langId: langIdProp,
  onChange: onChangeProp,
}: TextTemplateProps) {
  const [randomEar, setRandomEar] = useState(anyEar());
  const [selected, setSelected] = useState("normal");
  const [showShortDesc, setShowShortDesc] = useState(true);

  useEffect(() => {
    if (langIdProp === "en" || langIdProp === "es")
      return;
    if (templatesNormal.find((e) => e.value === selected) === undefined) {
      setSelected(templatesNormal[0].value);
      setShowShortDesc(true);
    }
  }, [langIdProp]);
  
  const handleSelected = (e: ChangeEvent<HTMLInputElement>) => {
    //const { value } = e.name;d
    //console.log(e);
    //console.log(e.currentTarget);
    //console.log(e.currentTarget.value);
    setSelected(e.currentTarget.value);
    setShowShortDesc(true);
    onChangeProp?.call(null, e.currentTarget.value);
    //setSelected()
  }

  return <>
            <div className='text-templates'>
          Template: 
          {
            templatesNormal.map((e, index) => (<span key={index}>
              <input type="radio" id={`choise${index}`} name="contact" value={e.value} checked={selected === e.value}
                onChange={handleSelected} />
              <label htmlFor={`choise${index}`} suppressHydrationWarning>{e.label.replace('$ear', randomEar)}</label>
            </span>))
          }
          {
            (langIdProp === "en" || langIdProp === "es") &&
            templatesDialog2P.map((e, index) => (<span key={index + templatesNormal.length}>
              <input type="radio" id={`choise${index + templatesNormal.length}`}
                name="contact" value={e.value} checked={selected === e.value}
                onChange={handleSelected} />
              <label htmlFor={`choise${index + templatesNormal.length}`} suppressHydrationWarning>
                {e.label.replace('$ear', randomEar)}</label>
            </span>))
          }
        </div>
        <div className='template-guide'>
          {
            description[selected] !== undefined ?
              description[selected].split('\n').map((e, _) => (
                <> {e} <br/> </>
              ))
            : ""
          }
        </div>

  </>
}