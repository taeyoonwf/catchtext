import { useContext, useEffect, useState } from 'react';
import AddTextMain, { DivTextArgs } from '../add-text-panels/addTextMain';
import { MetaInfoForTextUnit, TextUnitDataUpdate } from '../baseTypes';
import { DataStorageContext } from '../data-storage/dataStorage';
import { DialectWithGender } from '../baseUtils';

export default function AddText() {
  const {GetSignIn,
    SetStorageDataByUrlParam,
    GetTextForAddText,
    SetTextForAddText,
    UpdateTextUnits,
    AddTextUnits,
    AddParagraph,
  } = useContext(DataStorageContext);
  const [text, setText] = useState("");
  const [paragraphKey, setParagraphKey] = useState(AddParagraph());

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

  const saveAllSentences = async (
    textSet: DivTextArgs[],
    textUnitValues?: TextUnitDataUpdate,
  ) => {
    console.log(textSet);
    console.log(textUnitValues);
    const resultPromise = new Promise<void>((resolve, reject) => {
      AddTextUnits(paragraphKey, textSet.length).then((e0) => {
        UpdateTextUnits(textSet.map((e, index) => ({
          speed: textUnitValues?.speed,
          text: e.sentence,
          langId: textUnitValues?.langId,
          ...(typeof e.annotation?.isFemale === 'boolean' ? {dialectId: DialectWithGender(textUnitValues?.langId, e.annotation.isFemale)} : {}),
          paragraphKeyId: paragraphKey + "-" + index,
          translations: [],
          length: 0,
          ...(e.annotation !== undefined ? {
            questionNum: e.annotation.questionNum,
            isQuestionOption: e.annotation.isOption,
            isAnswer: e.annotation.isAnswer,
            isFemale: e.annotation.isFemale,
          } as MetaInfoForTextUnit : {})
        } as TextUnitDataUpdate))).then((e1) => {
          SetTextForAddText("").then((e2) => {
            console.log(`setText("")`);
            setText("");
            resolve();
          });
          //resolve();
        })
        .catch(err => reject(err));
      })
      .catch(err => reject(err));
    });
    /*resultPromise.then((e0) => {
      SetTextForAddText("").then((e1) => {
        console.log(`call onSaveDoneProp`);
        onSaveDoneProp.call(null);
        //console.log(`setText("")`);
      });
      //console.log(`call onSaveDoneProp`);
      //setText("");
      //onSaveDoneProp.call(null);
    });*/
    // TODO: loading modal?
    //console.log(`setText("")`);
    //setText("");
  };

  const handleTextChange = async (value: string) => {
    setText(value);
    await SetTextForAddText(value);
  }

  return (<>
    <AddTextMain paragraphKey={paragraphKey}
      text={text}
      onSave={saveAllSentences}
      onTextChange={handleTextChange}
    />
  </>);
}