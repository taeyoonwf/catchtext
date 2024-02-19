"use client"
import React, { useContext } from 'react';
import { DataStorageContext } from './dataStorage';

export default function DataStorageTest() {
  const { GetSignIn, SetSignIn } = useContext(DataStorageContext);

  const SwitchSignIn = () => {
    SetSignIn!(!GetSignIn());
  }

  return (<>
    {GetSignIn() ? 'true' : 'false'} <br />
    <button onClick={SwitchSignIn}>Sign In</button>
  </>);
}