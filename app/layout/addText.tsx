import AddTextMain, { DivTextArgs } from '../add-text-panels/addTextMain';
import { TextUnitDataUpdate } from '../baseTypes';
import { LanguageIdentifier } from '../language-identifier/languageIdentifier';
import { SpeechSynthesizer } from '../speech-synthesizer/speechSynthesizer';

export default function AddText() {
  const saveAllSentences = (
    textSet: DivTextArgs[],
    textUnitValues?: TextUnitDataUpdate,
  ) => {
    console.log(textSet);
    console.log(textUnitValues);
  };

  return (<SpeechSynthesizer><LanguageIdentifier>
    <AddTextMain onSave={saveAllSentences}/>
  </LanguageIdentifier></SpeechSynthesizer>);
}