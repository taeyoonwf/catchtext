"use client"
import React, { useState } from 'react';
import TextUnit, { LangIdType, TextUnitData } from './text-unit';

const tmpData: TextUnitData = {
  txt: "Salgo de mi habitación y veo la hora en un reloj del pasillo.",
  lid: "es",
  trs: [
    "I walk out of my room and check the time on a clock in the hallway.",
    "en",
    "나는 방을 나와 복도에 있는 시계로 시간을 확인한다.",
    "ko"
  ],

  tid: "1hpfs",
  spd: 1,
  len: 0,
  prg: "s5oa7",
  crt: 1663589481,
  mdf: 1663594289,
  pid: 4,
  did: 'es-ES'
};

export default function Home() {
  const [textUnits, setTextUnits] = useState<{}[]>([]);

  const addTextUnit = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTextUnits((prev) => [...prev, {}]);
  };

  return (<>
            <div className='add-button-panel'>
                <button onClick={addTextUnit} className='add-button'>+</button>
            </div>
            {textUnits.map((textUnit, index) => (
              <TextUnit key={index}/>
            ))}
    <TextUnit
      text={tmpData['txt']}
      langId={tmpData['lid']}
      translations={tmpData['trs']}
      speed={1.0}
      length={14.2}
    />
  </>);
}