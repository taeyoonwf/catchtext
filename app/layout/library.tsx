"use client"
import React, { useState } from 'react';
import { SpeechSynthesizer } from '../speech-synthesizer/speechSynthesizer';
import { LanguageIdentifier } from '../language-identifier/languageIdentifier';
import TextUnit from '../text-unit/textUnit';
import { TextUnitAbbrData } from '../baseTypes';

export default function Library() {
    const [textUnits, setTextUnits] = useState<TextUnitAbbrData[]>([]);
    //const textUnits: TextUnitData = [];
    const addTextUnit = (e: React.MouseEvent<HTMLButtonElement>) => {
      setTextUnits((prev) => [...prev, {} as TextUnitAbbrData]);
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