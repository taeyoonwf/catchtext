import React from 'react';
import SelectorLangId from "./selectorLangId";

export default function Home() {
  return (<>
    <div>
      <SelectorLangId defaultSelectedKey='fr' />
    </div>
    <div>
      <SelectorLangId defaultSelectedKey='---' />
    </div>
    <div>
      <SelectorLangId defaultSelectedKey='es' />
    </div>
  </>);
}