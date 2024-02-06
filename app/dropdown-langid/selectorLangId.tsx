"use client"
import React, { useState } from 'react';
import './layout.css';

const langIds: string[] = ['---', 'de', 'en', 'es', 'fr', 'hi', 'id', 'it',
'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'zh'];

interface SelectorLangIdProps {
    defaultSelectedKey: string;
}

export default function SelectorLangId({defaultSelectedKey}: SelectorLangIdProps) {
    const [langId, setLangId] = useState(defaultSelectedKey);
    const [btnHover, setBtnHover] = useState(false);
    const [stop, setStop] = useState(false);

    const changeLangId = (e: React.MouseEvent<HTMLButtonElement>) => {
        const newLangId = e.currentTarget.innerHTML;
        setLangId(newLangId);
        setBtnHover(false);
        SelectorLangId.prototype.justClosed = true;
    };

    return (
    <div className="sel-lang-id-dropdown"
        onMouseMove={() => {
            setBtnHover(!stop && SelectorLangId.prototype.justClosed != true);
            SelectorLangId.prototype.justClosed = false;
        }}
        onMouseOut={() => {
            setBtnHover(false);
            setStop(false);
        }}
        //onMouseEnter={() => console.log('mouse enter')}
        //onMouseLeave={() => console.log('mouse leave')}
    >
        <button className="sel-lang-id-dropbtn"
            onClick={() => {
                setStop(true);
                SelectorLangId.prototype.justClosed = true;
            }}
        >
            {langId}
        </button>
        <div className={`${(btnHover && !stop) ? "display-block" : "display-none"} sel-lang-id-dropdown-content`}>
            {langIds.map((theId) => (theId !== '---' &&
                <button key={theId} onClick={changeLangId}>{theId}</button>
            ))}
        </div>
    </div>);
}