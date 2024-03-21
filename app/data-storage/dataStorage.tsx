import React, { createContext, useState } from "react";
import { TextUnitData, TextUnitDataUpdate } from "../baseTypes";
import { compb64toobj, obj2compb64 } from "./compressUtils";
import { useSearchParams } from "next/navigation";

interface DataStorageContextType {
  GetSignIn: () => boolean;
  SetSignIn: (newSignIn: boolean) => void;
  GetTextUnits: () => TextUnitData[];
  SetTextUnits: (data: TextUnitData[]) => void;
  SetTextUnitsByUrlParam: () => Promise<void>;
  UpdateTextUnit: (data: TextUnitDataUpdate) => Promise<void>;
  AddTextUnit: () => Promise<string>;  // textId
  AddParagraph: () => string; // paragraphKey
}

const DataStorageContext = createContext<DataStorageContextType>({
  GetSignIn: () => false,
  SetSignIn: () => {},
  GetTextUnits: () => [],
  SetTextUnits: () => {},
  SetTextUnitsByUrlParam: async () => {},
  UpdateTextUnit: async () => {},
  AddTextUnit: async () => "",
  AddParagraph: () => "",
});

const DATA_PARAM = '?d=';
const UPDATE_APPLY_DELAY = 1000; // ms

let textUnits: TextUnitData[] = [];
let paragraphKeyToIndex: { [key in string]: number } = {};

function DataStorage({
  children,
}: {
  children: React.ReactNode
}) {
  const [signIn, setSignIn] = useState<boolean>(false);
  let lastModifiedTime: number = new Date().getTime() + (new Date().getTimezoneOffset() * 60);
  const searchParams = useSearchParams();
  const [urlParamData, setUrlParamData] = useState(searchParams.get('d'));

  const GetSignIn = () => signIn;
  const GetTextUnits = () => {
    console.log(`GetTextUnits called`);
    console.log(textUnits);
    console.log(`GetTextUnits return`);
    return textUnits;
  }

  const SetTextUnits = (data: TextUnitData[]) => {
    textUnits = data;
    paragraphKeyToIndex = {};
    for (let i = 0; i < textUnits.length; ++i) {
      const key = textUnits[i].paragraphKey + '-' + textUnits[i].paragraphId;
      paragraphKeyToIndex[key] = i;
    }
  }

  const SetTextUnitsByUrlParam = async () => { //urlBase64Data: string) => {
    if (urlParamData === null) {
      SetTextUnits([]);
      return;
    }
    const urlBase64Data = urlParamData!;
    console.log(`SetTextUnitsByUrlParam Done0 ${urlBase64Data}`);
    const data = urlBase64Data.replace(/-/g, '+').replace(/_/g, '/');
    console.log(`SetTextUnitsByUrlParam Done0-1 ${data}`);
    const newTextUnits = await compb64toobj(data, 'deflate');
    //newTextUnits.the
    console.log(`SetTextUnitsByUrlParam Done0-2`);
    console.log(newTextUnits);
    SetTextUnits(newTextUnits);
    console.log(`SetTextUnitsByUrlParam Done1 ${data}`);
    console.log(newTextUnits);
    console.log(textUnits);
    console.log(`SetTextUnitsByUrlParam Done2`);
  }

  const GetOrganizedTextUnits = () => {
    const orgTextUnits: TextUnitData[] = [];
    for (const textUnit of textUnits) {
      const transLength = textUnit.translations.length;
      const transList: string[] = [];
      for (let i = 0; i < transLength; i += 2) {
        const trans = textUnit.translations[i];
        const langId = textUnit.translations[i + 1];
        if (trans.trim().length !== 0) {
          transList.push(trans);
          transList.push(langId);
        }
      }
      if (textUnit.text.trim().length === 0 && transList.length === 0)
        continue;

      orgTextUnits.push({...textUnit, ...{translations: transList}});
    }
    return orgTextUnits;
  }

  const UpdateStorage = async () => {
    console.log(`UpdateStorage ${signIn}`);
    if (signIn) {

    }
    else {
      lastModifiedTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60);
      setTimeout(async () => {
        const curTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60);
        if (curTime > lastModifiedTime + UPDATE_APPLY_DELAY * 0.9) {
          const orgTextUnits = GetOrganizedTextUnits();
          const b64textUnits = (await obj2compb64(orgTextUnits, 'deflate'))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
          setUrlParamData(b64textUnits);
          window.history.pushState({}, '', DATA_PARAM + b64textUnits + window.location.hash);

          /*const data = b64textUnits.replace(/-/g, '+').replace(/_/g, '/');
          const obj = await compb64toobj(data, 'deflate');
          console.log(`return(obj)`);
          console.log(obj); */
        }
      }, UPDATE_APPLY_DELAY);
    }
  }

  const ConvPairsIntoArr = (e: string[][]) => e.reduce((acc: string[], curr, index) => (acc.push(...curr), acc), []);
  const UpdateTextUnit = async (data: TextUnitDataUpdate) => {
    const key = data.paragraphKeyId;
    console.log(paragraphKeyToIndex);
    console.log(`find the key ${key}`);
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
    await UpdateStorage();
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

  const AddTextUnit = async () => {
    const randomPragKey = getRandomId();
    paragraphKeyToIndex[randomPragKey + '-0'] = textUnits.length;
    textUnits.push({
      paragraphKey: randomPragKey,
      paragraphId: 0,
    } as TextUnitData);
    await UpdateStorage();

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
      SetTextUnitsByUrlParam,
      UpdateTextUnit,
      AddTextUnit,
      AddParagraph,
    }}>
      {children}
    </DataStorageContext.Provider>
  );
}

export { DataStorage, DataStorageContext };