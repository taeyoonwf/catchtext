import React from 'react';
import SelectorLangId from "./selectorLangId";

export default function Home() {
  return (<>
    <div>
      <SelectorLangId value='fr' />
    </div>
    <div>
      <SelectorLangId />
    </div>
    <div>
      <SelectorLangId value='es' />
    </div>
    <div>
      <SelectorLangId value='de' />
    </div>
  </>);
}