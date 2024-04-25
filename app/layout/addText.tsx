import AddTextMain, { DivTextArgs } from '../add-text-panels/addTextMain';
import { TextUnitDataUpdate } from '../baseTypes';
import { LanguageIdentifier } from '../language-identifier/languageIdentifier';
import { SpeechSynthesizer } from '../speech-synthesizer/speechSynthesizer';
import { TextUnitProps } from '../text-unit/textUnit';

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