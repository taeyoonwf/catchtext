"use client"
import React, { useContext, useEffect, useState } from 'react';
import { SpeechSynthesizer } from '../speech-synthesizer/speechSynthesizer';
import { LanguageIdentifier } from '../language-identifier/languageIdentifier';
import TextUnit from '../text-unit/textUnit';
import { TextUnitAbbrData, TextUnitDataUpdate } from '../baseTypes';
import { DataStorageContext } from '../data-storage/dataStorage';

export default function Library() {
    const [textUnits, setTextUnits] = useState<TextUnitAbbrData[]>([]);
    const {GetSignIn, AddTextUnit, UpdateTextUnit, SetStorageDataByUrlParam, GetTextUnits} = useContext(DataStorageContext);
    const [storageLoadingCount, setStorageLoadingCount] = useState<number>(0);

    useEffect(() => {
      if (!GetSignIn()) {
        (async function() {
          await SetStorageDataByUrlParam().then(() => {
            const textUnitsOfStorage = GetTextUnits();
            console.log(textUnitsOfStorage);
            setStorageLoadingCount((prev) => (prev + textUnitsOfStorage.length));
            setTextUnits(textUnitsOfStorage.map((e, index) => ({
              spd: e.speed,
              len: e.length,
              txt: e.text,
              lid: e.langId,
              did: e.dialectId,
              trs: e.translations,
              prk: e.paragraphKey,
              pid: e.paragraphId,
            } as TextUnitAbbrData)));
          });
        })();
      }
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
      console.log(`storage loading count? ${storageLoadingCount}`);
      if (storageLoadingCount <= 0) {
        await UpdateTextUnit(value);
      }
      else {
        setStorageLoadingCount((prev) => (prev - 1));
      }
    }

    return (<>
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
    </>);
}