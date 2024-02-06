import React from 'react';
import TextUnit from './text-unit';

const tmpData = {
    "tid": "1hpfs",
    "spd": 1,
    "len": 0,
    "txt": "Salgo de mi habitación y veo la hora en un reloj del pasillo.",
    "lid": "es",
    "prg": "s5oa7",
    "crt": 1663589481,
    "mdf": 1663594289,
    "trs": [
      "I walk out of my room and check the time on a clock in the hallway.",
      "en"
    ],
    "pid": 4
};

export default function Home() {
  return (<>
    <TextUnit defaultText={tmpData['txt']} defaultLangId={tmpData['lid']} translations={tmpData['trs']} />
  </>);
}