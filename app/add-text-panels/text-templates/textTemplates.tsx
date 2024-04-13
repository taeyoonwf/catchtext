"use client"
import { ChangeEvent, useEffect, useState } from 'react';
import './layout.css';
import { BlankType, LangIdType } from '@/app/baseTypes';
import { TemplateProcessor, TemplateInterface, TemplateNormal, NormalProcessor } from './templates/normal';
import { TemplateListeningTestDialog1P } from './templates/listeningTestDialog1P';
import { TemplateListeningTestDialogFM } from './templates/listeningTestDialogFM';
import { TemplateListeningTestDialogMF } from './templates/listeningTestDialogMF';


export interface TextTemplateProps {
  langId?: LangIdType|BlankType;
  onChange?: (value: string, processor: TemplateProcessor) => void;
}

const templates: TemplateInterface[] = [
  TemplateNormal,
  TemplateListeningTestDialog1P,
  TemplateListeningTestDialogFM,
  TemplateListeningTestDialogMF,
];

export default function TextTemplates({
  langId: langIdProp,
  onChange: onChangeProp,
}: TextTemplateProps) {
  const [selected, setSelected] = useState("normal");
  const [showShortDesc, setShowShortDesc] = useState(true);

  useEffect(() => {
    console.log(`langIdProp changed!`);
    if (templates.find((e) => (e.activeLangIds.includes(langIdProp as LangIdType) && e.value === selected)) === undefined) {
      setSelected(templates[0].value);
      setShowShortDesc(true);
    }
  }, [langIdProp]);
  
  const handleSelected = (e: ChangeEvent<HTMLInputElement>) => {
    //const { value } = e.name;d
    //console.log(e);
    //console.log(e.currentTarget);
    console.log(e.currentTarget.value);
    setSelected(e.currentTarget.value);
    setShowShortDesc(true);

    const processor = templates.find((tmplt) => tmplt.value === e.currentTarget.value)?.processor;
    onChangeProp?.call(null,
      e.currentTarget.value,
      processor !== undefined ? processor : NormalProcessor
    );
    console.log(`handle selected end`);
  }

  const splitAndAddBr = (e: string) => e.split('\n').map((s, _) => (
    <>{_ > 0 ? <><br/>{s}</> : <>{s}</>}</>
  ));

  return <>
            <div className='text-templates'>
          Template: 
          {
            templates.map((e, index) => (e.activeLangIds.includes(langIdProp as LangIdType) &&
            <span key={index}>
              <input type="radio" id={`choise${index}`} name="contact" value={e.value} checked={selected === e.value}
                onChange={handleSelected} />
              <label htmlFor={`choise${index}`} suppressHydrationWarning>{e.label()}</label>
            </span>))
          }
        </div>
        <div className='template-guide'>
          {
            templates.map((e, index) => (e.value === selected &&
              splitAndAddBr(showShortDesc ? e.shortDesc : e.longDesc)))
          }
          <button onClick={() => setShowShortDesc((prev) => !prev)}>{showShortDesc ? '↧' : '↥'}</button>
        </div>

  </>
}