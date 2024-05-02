"use client"
import React, { useState } from 'react';
import { SpeechSynthesizer } from '../speech-synthesizer/speechSynthesizer';
import { LanguageIdentifier } from '../language-identifier/languageIdentifier';
import { TextUnitAbbrData } from '../baseTypes';
import TextUnit from '../text-unit/textUnit';

/*
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
}; */

const tmpData: TextUnitAbbrData =   {
  "spd": 1,
  "len": 0,
  "txt": "'Well, When I was four years old, I had a dream about a spoon falling off a table and making a loud sound on the floor,' Jen said.",
  "lid": "en", 
  "did": "en-GB-1",
  "prk": "xsose",
  "crt": 1663483147,
  "mdf": 1663483611,
  "trs": [],
  "pid": 15
};

export default function Home() {
  const [autoPlay, setAutoPlay] = useState(false);

  return (<SpeechSynthesizer><LanguageIdentifier>
    <button onClick={() => setAutoPlay((prev) => !prev)}>{autoPlay ? 'Stop' : 'Play'}</button>
    <TextUnit
      text={tmpData.txt}
      langId={tmpData.lid}
      translations={tmpData.trs}
      speed={tmpData.spd}
      length={tmpData.len}
      dialectId={tmpData.did}
      autoPlay={autoPlay}
      onPlayFinished={() => setAutoPlay(false)}
    />
  </LanguageIdentifier></SpeechSynthesizer>);
}