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
type LangIdType = typeof langIds[number];
type BlankType = typeof blank;

export default function Home() {
    const [theKey, setTheKey] = useState<LangIdType|BlankType>('en');
    const handleLangId = (newKey: LangIdType) => {

    }

    /*<DropdownPopup blankKey={blank} keys={langIds} selectedKey={theKey} onChange={handleLangId}/>
    <span>~~</span>
    <DropdownPopup blankKey={blank} keys={langIds.slice(0, 5)} selectedKey='id' />
    <span>~~~</span>
    <DropdownPopup<LangIdType, BlankType> blankKey={blank} keys={['es', 'en', 'fr', 'it']} selectedKey='ko' />
*/
  return (<>
    <div>
      <DropdownMenu blankKey={blank} keys={testIds} selectedKey='The menu 1' />
      <span>~~</span>
      <DropdownSelector blankKey={blank} keys={langIds.slice(0, 5)} selectedKey='id' />
    </div>
    <div>
      <DropdownMenu blankKey='------------' keys={dialectIds} />
    </div>
  </>);
}
