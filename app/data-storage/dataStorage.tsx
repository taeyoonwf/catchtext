import React, { createContext, useState } from "react";
import { TextUnitData, TextUnitDataUpdate } from "../baseTypes";

interface DataStorageContextType {
  GetSignIn: () => boolean;
  SetSignIn: (newSignIn: boolean) => void;
  GetTextUnits: () => TextUnitData[];
  SetTextUnits: (data: TextUnitData[]) => void;
  UpdateTextUnit: (data: TextUnitDataUpdate) => void;
  AddTextUnit: () => string;  // textId
  AddParagraph: () => string; // paragraphKey
}

const DataStorageContext = createContext<DataStorageContextType>({
  GetSignIn: () => false,
  SetSignIn: () => {},
  GetTextUnits: () => [],
  SetTextUnits: () => {},
  UpdateTextUnit: () => {},
  AddTextUnit: () => "",
  AddParagraph: () => "",
});

function DataStorage({
  children,
}: {
  children: React.ReactNode
}) {
  const [signIn, setSignIn] = useState<boolean>(false);
  let textUnits: TextUnitData[] = [];
  let paragraphKeyToIndex: { [key in string]: number } = {};

  const GetSignIn = () => signIn;
  const GetTextUnits = () => textUnits;

  const SetTextUnits = (data: TextUnitData[]) => {
    textUnits = data;
    paragraphKeyToIndex = {};
    for (let i = 0; i < textUnits.length; ++i) {
      const key = textUnits[i].paragraphKey + '-' + textUnits[i].paragraphId;
      paragraphKeyToIndex[key] = i;
    }
  }

  const ConvPairsIntoArr = (e: string[][]) => e.reduce((acc: string[], curr, index) => (acc.push(...curr), acc), []);
  const UpdateTextUnit = (data: TextUnitDataUpdate) => {
    const key = data.paragraphKeyId;
    console.log(paragraphKeyToIndex);
    if (paragraphKeyToIndex[key] === undefined)
      return;
    const index = paragraphKeyToIndex[key];

    const trans = ConvPairsIntoArr(data.translations);
    textUnits[index] = {
      speed: data.speed,
      length: data.length,
      text: data.text,
      langId: data.langId,
      dialectId: data.dialectId,
      translations: trans,
      paragraphKey: key.split('-')[0],
      paragraphId: Number.parseInt(key.split('-')[1]),
      created: textUnits[index].created,
      modified: new Date().getTime() + (new Date().getTimezoneOffset() * 60),
    };
    console.log(textUnits[index]);
  }

  const randomString = (length: number) => {
    let result = "";
    const characters: string = "0123456789abcdeghijlmnopqrtvwxyz";
    const chLength = characters.length;

    while (result.length < length)
      result += characters.charAt(Math.floor(Math.random() * chLength));
    return result;
  }

  const getRandomId = () => {
    while (true) {
      const key = randomString(5);
      if (paragraphKeyToIndex[key + '-0'] === undefined)
        return key;
    }
    return 'catch';
  }

  const AddTextUnit = () => {
    const randomPragKey = getRandomId();
    paragraphKeyToIndex[randomPragKey + '-0'] = textUnits.length;
    textUnits.push({
      paragraphKey: randomPragKey,
      paragraphId: 0,
    } as TextUnitData);

    return randomPragKey;
  }

  const AddParagraph = () => {
    const randomId = getRandomId();
    return randomId;
  }

  return (
    <DataStorageContext.Provider value={{
      GetSignIn,
      SetSignIn: setSignIn,
      GetTextUnits,
      SetTextUnits,
      UpdateTextUnit,
      AddTextUnit,
      AddParagraph,
    }}>
      {children}
    </DataStorageContext.Provider>
  );
}

export { DataStorage, DataStorageContext };