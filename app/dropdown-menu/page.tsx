"use client"
import React, { useState } from 'react';
//import DropdownSelector from "./dropdownSelector";
import DropdownSelector from '../dropdown-selector/dropdownSelector';
import DropdownMenu from './dropdownMenu';

const langIds = ['de', 'en', 'es', 'fr', 'hi', 'id', 'it',
'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'zh'] as const;
const testIds = ['The menu 1', 'Menu Number 2', 'Menu #3', 'The menu four'] as const;
const blank = '---' as const;
const dialectIds: string[] = ['en-GB-0', 'en-GB-1', 'en-US', 'es-ES', 'es-US', 'zh-CN', 'zh-HK', 'zh-TW'];

export default function Home() {

  return (<>
    <div>
      <DropdownMenu items={testIds} onSelected={(e, idx) => alert(`You selected #${idx}: ${e}`)}>The dropdown menu</DropdownMenu>
      <span>~~</span>
      <DropdownSelector blankKey={blank} keys={langIds.slice(0, 5)} selectedKey='id' />
    </div>
    <div>
      <DropdownMenu items={dialectIds}>---------</DropdownMenu>
    </div>
  </>);
}
