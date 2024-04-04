"use client"
import React, { CSSProperties, useState } from 'react';
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
      <span>
        OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
      </span>
      <DropdownMenu menuId={'0'} items={testIds} onSelected={(e, idx) => alert(`You selected #${idx}: ${e}`)} menuWidth={150}
        onMouseDown={() => console.log(`mouseDown on the dd-menu`)}
        addStyle={
          {...{"selection-color": '#987654'} as CSSProperties,
          backgroundColor: 'green'}
        }
      >
       The dropdown menu. This can be very long.
       Also, it can be Also, it can be multi-lined. Also, it can be multi-lined.
      </DropdownMenu>
      <DropdownMenu menuId={'1'} items={['a', 'bb', 'ccc']} menuWidth={50}>
        --Test--
      </DropdownMenu>
      <span>~~</span>
      <DropdownSelector blankKey={blank} keys={langIds.slice(0, 5)} selectedKey='id' />
    </div>
    <div>
      <DropdownMenu menuId={'2'} items={dialectIds} menuWidth={85}>---------</DropdownMenu>
    </div>
  </>);
}
