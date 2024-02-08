"use client"
import React, { useState } from 'react';
import TextUnit, { LangIdType, TextUnitData } from './text-unit';
import { SpeechSynthesizer } from '../speech-synthesizer/speechSynthesizer';

const tmpData: TextUnitData = {
  txt: "Salgo de mi habitación y veo la hora en un reloj del pasillo.",
  lid: "es",
  trs: [
    "I walk out of my room and check the time on a clock in the hallway.",
    "en",
    "나는 방을 나와 복도에 있는 시계로 시간을 확인한다.",
    "ko"
  ],
  spd: 1,
  len: 0,
  did: 'es-ES',

  tid: "1hpfs",
  prg: "s5oa7",
  crt: 1663589481,
  mdf: 1663594289,
  pid: 4,
};

export default function Home() {
  const [textUnits, setTextUnits] = useState<{}[]>([]);

  const addTextUnit = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTextUnits((prev) => [...prev, {}]);
  };

  return (<SpeechSynthesizer>
            <div className='add-button-panel'>
                <button onClick={addTextUnit} className='add-button'>+</button>
            </div>
            {textUnits.map((textUnit, index) => (
              <TextUnit key={index}/>
            )).reverse()}
    <TextUnit
      text={tmpData.txt}
      langId={tmpData.lid}
      translations={tmpData.trs}
      speed={tmpData.spd}
      length={tmpData.len}
      dialectId={tmpData.did}
    />
  </SpeechSynthesizer>);
}