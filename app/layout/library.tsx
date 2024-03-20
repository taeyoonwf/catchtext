"use client"
import React, { useContext, useEffect, useState } from 'react';
import { SpeechSynthesizer } from '../speech-synthesizer/speechSynthesizer';
import { LanguageIdentifier } from '../language-identifier/languageIdentifier';
import TextUnit from '../text-unit/textUnit';
import { TextUnitAbbrData, TextUnitDataUpdate } from '../baseTypes';
import { DataStorageContext } from '../data-storage/dataStorage';
import { useSearchParams } from 'next/navigation';

export default function Library() {
    //const searchParams = useSearchParams();
    const [textUnits, setTextUnits] = useState<TextUnitAbbrData[]>([]);
    const { AddTextUnit, UpdateTextUnit, SetTextUnitsByUrlParam, GetTextUnits } = useContext(DataStorageContext);
    //let storageUpdateEnabled = false;
    const [storageUpdateEnabled, setStorageUpdateEnabled] = useState<Boolean>(false);

    useEffect(() => {
      setStorageUpdateEnabled(false); // = false;
      const init = () => {
        const tu = GetTextUnits();
        console.log(tu);
        setTextUnits(tu.map((e, index) => ({
          spd: e.speed,
          len: e.length,
          txt: e.text,
          lid: e.langId,
          did: e.dialectId,
          trs: e.translations,
          prk: e.paragraphKey,
          pid: e.paragraphId,
        } as TextUnitAbbrData)));
        //storageUpdateEnabled = true;
      }

      (async function() {
        //console.log(`library useEffect data ${data}`);
        await SetTextUnitsByUrlParam().then(() => {
          console.log(`Library type #2`);
          init();
          setStorageUpdateEnabled(true);
        });
      })();

      //const data = searchParams.get('d');
      /*console.log(`Library Effect! ${data}`);
      if (data !== null) {
        (async function(data: string) {
          console.log(`library useEffect data ${data}`);
          await SetTextUnitsByUrlParam(data).then(() => {
            console.log(`Library type #2`);
            init();
            setStorageUpdateEnabled(true);
          });
        })(data);
      }
      else {
        console.log(`Library type #1`);
        init();
        setStorageUpdateEnabled(true);
      }*/
    }, []);

    //const textUnits: TextUnitData = [];
    const addTextUnit = async (e: React.MouseEvent<HTMLButtonElement>) => {
      //console.log(AddTextUnit);
      const paragraphKey = await AddTextUnit();
      console.log('here0 ' + paragraphKey);
      setTextUnits((prev) => [...prev, {
        prk: paragraphKey,
        pid: 0,
      } as TextUnitAbbrData]);
    };

    const handleChange = async (value: TextUnitDataUpdate) => {
      console.log(value);
      //console.log(`value: ${value} - changed`);
      console.log(`storage update enabled? ${storageUpdateEnabled}`);
      if (storageUpdateEnabled) {
        await UpdateTextUnit(value);
      }
    }

    return (<SpeechSynthesizer><LanguageIdentifier>
              <div className='add-button-panel'>
                  <button onClick={addTextUnit} className='add-button'>+</button>
              </div>
              {textUnits.length > 0 && textUnits.map((textUnit, index) => (
                <TextUnit
                  key={index}
                  textId={textUnit.prk + '-' + textUnit.pid}
                  text={textUnit.txt}
                  langId={textUnit.lid}
                  translations={textUnit.trs}
                  speed={textUnit.spd}
                  length={textUnit.len}
                  dialectId={textUnit.did}
                  onChange={handleChange}
                />
              )).reverse()}
    </LanguageIdentifier></SpeechSynthesizer>);
}