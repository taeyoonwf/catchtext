"use client"
import React, { useState } from 'react';
import { SpeechSynthesizer } from '../speech-synthesizer/speechSynthesizer';
import { LanguageIdentifier } from '../language-identifier/languageIdentifier';
import TextUnit, { TextUnitData } from '../text-unit/textUnit';

export default function Library() {
    const [textUnits, setTextUnits] = useState<TextUnitData[]>([]);
    //const textUnits: TextUnitData = [];
    const addTextUnit = (e: React.MouseEvent<HTMLButtonElement>) => {
      setTextUnits((prev) => [...prev, {} as TextUnitData]);
    };
  
    return (<SpeechSynthesizer><LanguageIdentifier>
              <div className='add-button-panel'>
                  <button onClick={addTextUnit} className='add-button'>+</button>
              </div>
              {textUnits.length > 0 && textUnits.map((textUnit, index) => (
                <TextUnit key={index}/>
              )).reverse()}
    </LanguageIdentifier></SpeechSynthesizer>);
}