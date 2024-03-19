"use client"
import React, { useContext, useState } from 'react';
import { SpeechSynthesizer } from '../speech-synthesizer/speechSynthesizer';
import { LanguageIdentifier } from '../language-identifier/languageIdentifier';
import TextUnit from '../text-unit/textUnit';
import { TextUnitAbbrData, TextUnitDataUpdate } from '../baseTypes';
import { DataStorageContext } from '../data-storage/dataStorage';

export default function Library() {
    const [textUnits, setTextUnits] = useState<TextUnitAbbrData[]>([]);
    const { AddTextUnit, UpdateTextUnit } = useContext(DataStorageContext);

    //const textUnits: TextUnitData = [];
    const addTextUnit = (e: React.MouseEvent<HTMLButtonElement>) => {
      //console.log(AddTextUnit);
      const paragraphKey = AddTextUnit();
      console.log('here0 ' + paragraphKey);
      setTextUnits((prev) => [...prev, {
        prk: paragraphKey,
        pid: 0,
      } as TextUnitAbbrData]);
    };

    const handleChange = (value: TextUnitDataUpdate) => {
      console.log(value);
      //console.log(`value: ${value} - changed`);
      UpdateTextUnit(value);
    }

    return (<SpeechSynthesizer><LanguageIdentifier>
              <div className='add-button-panel'>
                  <button onClick={addTextUnit} className='add-button'>+</button>
              </div>
              {textUnits.length > 0 && textUnits.map((textUnit, index) => (
                <TextUnit key={index} textId={textUnit.prk + '-' + textUnit.pid} onChange={handleChange}/>
              )).reverse()}
    </LanguageIdentifier></SpeechSynthesizer>);
}