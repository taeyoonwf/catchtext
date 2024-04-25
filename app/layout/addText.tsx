import { useContext, useEffect, useState } from 'react';
import AddTextMain, { DivTextArgs } from '../add-text-panels/addTextMain';
import { TextUnitDataUpdate } from '../baseTypes';
import { LanguageIdentifier } from '../language-identifier/languageIdentifier';
import { SpeechSynthesizer } from '../speech-synthesizer/speechSynthesizer';
import { DataStorageContext } from '../data-storage/dataStorage';

export default function AddText() {
  const {GetSignIn, SetStorageDataByUrlParam, GetTextForAddText, SetTextForAddText} = useContext(DataStorageContext);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!GetSignIn()) {
      (async function() {
        await SetStorageDataByUrlParam().then(() => {
          const txt = GetTextForAddText();
          console.log(`TextForAddText: ${txt}`);
          setText(txt);
        });
      })();
    }
  }, []);

  const saveAllSentences = (
    textSet: DivTextArgs[],
    textUnitValues?: TextUnitDataUpdate,
  ) => {
    console.log(textSet);
    console.log(textUnitValues);
  };

  const handleTextChange = async (value: string) => {
    await SetTextForAddText(value);
  }

  return (<SpeechSynthesizer><LanguageIdentifier>
    <AddTextMain text={text} onSave={saveAllSentences} onTextChange={handleTextChange}/>
  </LanguageIdentifier></SpeechSynthesizer>);
}