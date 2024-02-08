import React from 'react';
import DropdownSelector from "./dropdownSelector";

const langIds = ['de', 'en', 'es', 'fr', 'hi', 'id', 'it',
'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'zh'] as const;
const blank = '---' as const;
const dialectIds: string[] = ['en-GB-0', 'en-GB-1', 'en-US', 'es-ES', 'es-US', 'zh-CN', 'zh-HK', 'zh-TW'];

export default function Home() {
  return (<>
    <div>
      <DropdownSelector blankKey={blank} keys={langIds} selectedKey='fr' />
    </div>
    <div>
      <DropdownSelector blankKey={blank} keys={langIds.slice(0, 5)} selectedKey='id' />
    </div>
    <div>
      <DropdownSelector blankKey={blank} keys={['es', 'en', 'fr', 'it']} selectedKey='ko' />
    </div>
    <div>
      <DropdownSelector blankKey='------------' keys={dialectIds} />
    </div>
  </>);
}