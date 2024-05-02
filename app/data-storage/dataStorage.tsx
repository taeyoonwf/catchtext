import React, { createContext, useState } from "react";
import { TextUnitData, TextUnitDataUpdate } from "../baseTypes";
import { compb64toobj, obj2compb64 } from "./compressUtils";
import { useSearchParams } from "next/navigation";

interface DataStorageContextType {
  GetSignIn: () => boolean;
  SetSignIn: (newSignIn: boolean) => void;
  GetTextForAddText: () => string;
  SetTextForAddText: (data: string) => Promise<void>;
  GetTextUnits: () => TextUnitData[];
  SetTextUnits: (data: TextUnitData[]) => void;
  SetStorageDataByUrlParam: () => Promise<void>;
  UpdateTextUnit: (data: TextUnitDataUpdate) => Promise<void>;
  UpdateTextUnits: (data: TextUnitDataUpdate[]) => Promise<void>;
  AddEmptyTextUnit: () => Promise<string>;  // textId
  AddTextUnits: (paragraphKey: string, data: TextUnitDataUpdate[]) => Promise<void>;
  AddParagraph: () => string; // paragraphKey
}

const DataStorageContext = createContext<DataStorageContextType>({
  GetSignIn: () => false,
  SetSignIn: () => {},
  GetTextForAddText: () => "",
  SetTextForAddText: async () => {},
  GetTextUnits: () => [],
  SetTextUnits: () => {},
  SetStorageDataByUrlParam: async () => {},
  UpdateTextUnit: async () => {},
  UpdateTextUnits: async () => {},
  AddEmptyTextUnit: async () => "",
  AddTextUnits: async () => {},
  AddParagraph: () => "",
});

const DATA_PARAM = '?d=';
const UPDATE_APPLY_DELAY = 1000; // ms

let textForAddText: string = "";
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
  const GetTextForAddText = () => textForAddText;

  const SetTextForAddText = async (data: string) => {
    if (textForAddText !== data) {
      textForAddText = data;
      await UpdateStorage();
    }
  }

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

  const SetStorageDataByUrlParam = async () => { //urlBase64Data: string) => {
    if (urlParamData === null) {
      SetTextUnits([]);
      return;
    }
    const urlBase64Data = urlParamData!;
    console.log(`SetStorageDataByUrlParam Done0 ${urlBase64Data}`);
    const data = urlBase64Data.replace(/-/g, '+').replace(/_/g, '/');
    console.log(`SetStorageDataByUrlParam Done0-1 ${data}`);
    const savedData: {[key: string]: any} = await compb64toobj(data, 'deflate');

    const newTextUnits = savedData["textUnits"];
    //newTextUnits.the
    console.log(`SetStorageDataByUrlParam Done0-2`);
    console.log(newTextUnits);
    SetTextUnits(newTextUnits);
    console.log(`SetStorageDataByUrlParam Done1 ${data}`);
    console.log(newTextUnits);
    console.log(textUnits);
    console.log(`SetTextUnitsByUrlParam Done2`);

    textForAddText = savedData["textForAddText"];
  }

  const GetOrganizedTextUnits = () => {
    const orgTextUnits: TextUnitData[] = [];
    for (const textUnit of textUnits) {
      console.log(textUnit);
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
      /*const angelMowersPromise = new Promise<string>((resolve, reject) => {
        // Simulate an asynchronous operation, e.g., mowing the lawn
        setTimeout(() => {
            // After the operation completes, resolve the promise
            resolve('We finished mowing the lawn');
            // Note: You should not reject the promise here.
            // If there's an error during the operation, handle it within this setTimeout callback.
        }, 100000); // Resolves after 100,000ms (roughly 1 minute and 40 seconds)
    }); */

      lastModifiedTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60);
      console.log(`lastModifiedTime: ${lastModifiedTime}`);
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          const curTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60);
          console.log(`curTime, lastModifiedTime: ${curTime} ${lastModifiedTime}`);
          if (curTime > lastModifiedTime + UPDATE_APPLY_DELAY * 0.9) {
            const orgTextUnits = GetOrganizedTextUnits();
            const b64textUnits = obj2compb64({
              textForAddText: textForAddText,
              textUnits: orgTextUnits,
            }, 'deflate').then((e) => {
              const b64 = e.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
              if (curTime > lastModifiedTime + UPDATE_APPLY_DELAY * 0.9) {
                setUrlParamData(b64);
                window.history.pushState({}, '', DATA_PARAM + b64 + window.location.hash);
              }
              resolve();
            });
              //.replace(/\+/g, '-')
              //.replace(/\//g, '_')
              //.replace(/=/g, '');
            //setUrlParamData(b64textUnits);
            //window.history.pushState({}, '', DATA_PARAM + b64textUnits + window.location.hash);
 
            //resolve();
            /*const data = b64textUnits.replace(/-/g, '+').replace(/_/g, '/');
            const obj = await compb64toobj(data, 'deflate');
            console.log(`return(obj)`);
            console.log(obj); */
          }
        }, UPDATE_APPLY_DELAY);
      });
      //await pushStatePromise;
      /*.then(() => {
        
      })
      .catch(err => console.log(err)); */
      /*setTimeout(async () => {
        const curTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60);
        if (curTime > lastModifiedTime + UPDATE_APPLY_DELAY * 0.9) {
          const orgTextUnits = GetOrganizedTextUnits();
          const b64textUnits = (await obj2compb64({
            textForAddText: textForAddText,
            textUnits: orgTextUnits,
          }, 'deflate'))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
          setUrlParamData(b64textUnits);
          window.history.pushState({}, '', DATA_PARAM + b64textUnits + window.location.hash);
        }
      }, UPDATE_APPLY_DELAY); */
    }
  }

  const ConvPairsIntoArr = (e: string[][]) => e.reduce((acc: string[], curr, index) => (acc.push(...curr), acc), []);
  const UpdateTextUnit = async (data: TextUnitDataUpdate) => {
    await UpdateTextUnits([data]);
  }

  const UpdateTextUnits = async (data: TextUnitDataUpdate[]) => {
    for (const unit of data) {
      const key = unit.paragraphKeyId;
      if (paragraphKeyToIndex[key] === undefined)
        continue;
      const index = paragraphKeyToIndex[key];
      const trans = ConvPairsIntoArr(unit.translations);
      textUnits[index] = {
        speed: unit.speed,
        length: unit.length,
        text: unit.text,
        langId: unit.langId,
        dialectId: unit.dialectId,
        translations: trans,
        paragraphKey: key.split('-')[0],
        paragraphId: Number.parseInt(key.split('-')[1]),
        created: textUnits[index].created,
        modified: new Date().getTime() + (new Date().getTimezoneOffset() * 60),
      };
    }
    console.log(textUnits);
    await UpdateStorage();
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

  const AddEmptyTextUnit = async () => {
    const randomPragKey = getRandomId();
    paragraphKeyToIndex[randomPragKey + '-0'] = textUnits.length;
    textUnits.push({
      paragraphKey: randomPragKey,
      paragraphId: 0,
    } as TextUnitData);
    //await UpdateStorage();

    return randomPragKey;
  }

  const AddTextUnits = async (paragraphKey: string, data: TextUnitDataUpdate[]) => {
    for (let i = 0; i < data.length; i++) {
      const index = data.length - i - 1;
      paragraphKeyToIndex[paragraphKey + '-' + index] = textUnits.length;
      textUnits.push({
        paragraphKey,
        paragraphId: index,
      } as TextUnitData);
    }
    await UpdateTextUnits(data);
    //await UpdateStorage();
  }

  const AddParagraph = () => {
    const randomId = getRandomId();
    return randomId;
  }

  return (
    <DataStorageContext.Provider value={{
      GetSignIn,
      SetSignIn: setSignIn,
      GetTextForAddText,
      SetTextForAddText,
      GetTextUnits,
      SetTextUnits,
      SetStorageDataByUrlParam,
      UpdateTextUnit,
      UpdateTextUnits,
      AddEmptyTextUnit,
      AddTextUnits,
      AddParagraph,
    }}>
      {children}
    </DataStorageContext.Provider>
  );
}

export { DataStorage, DataStorageContext };