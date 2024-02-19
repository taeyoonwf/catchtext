import React, { createContext, useState } from "react";
import { TextUnitData } from "../baseTypes";

interface DataStorageContextType {
  GetSignIn: () => boolean;
  SetSignIn: (newSignIn: boolean) => void;
  GetTextUnits: () => TextUnitData[];
  SetTextUnits: (data: TextUnitData[]) => void;
  UpdateTextUnit: (data: TextUnitData) => void;
  AddTextUnit: () => string; // textId
}

const DataStorageContext = createContext<DataStorageContextType>({
  GetSignIn: () => false,
  SetSignIn: () => {},
  GetTextUnits: () => [],
  SetTextUnits: () => {},
  UpdateTextUnit: () => {},
  AddTextUnit: () => "",
});

function DataStorage({
  children,
}: {
  children: React.ReactNode
}) {
  const [signIn, setSignIn] = useState<boolean>(false);
  let textUnits: TextUnitData[] = [];
  let textIdToIndex: { [key in string]: number } = {};

  const GetSignIn = () => signIn;
  const GetTextUnits = () => textUnits;

  const SetTextUnits = (data: TextUnitData[]) => {
    textUnits = data;
    textIdToIndex = {};
    for (let i = 0; i < textUnits.length; ++i) {
      textIdToIndex[textUnits[i].textId] = i;
    }
  }

  const UpdateTextUnit = (data: TextUnitData) => {
    if (textIdToIndex[data.textId] === undefined)
      return;
    const index = textIdToIndex[data.textId];

    textUnits[index] = data;
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
      if (textIdToIndex[key] !== undefined)
        return key;
    }
    return 'catch';
  }

  const AddTextUnit = () => {
    const randomId = getRandomId();
    textUnits.push({
      textId: randomId
    } as TextUnitData);

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
    }}>
      {children}
    </DataStorageContext.Provider>
  );
}

export { DataStorage, DataStorageContext };