"use client"
import React, { ChangeEventHandler, useState } from 'react';
import './layout.css';

export const langIds = ['de', 'en', 'es', 'fr', 'hi', 'id', 'it',
'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'zh'] as const;
export const blank = '---' as const;

export type LangId = typeof langIds[number];
export type Blank = typeof blank;

const dialectIds: string[] = ['en-GB-0', 'en-GB-1', 'en-US', 'es-ES', 'es-US', 'zh-CN', 'zh-HK', 'zh-TW'];

// Object.keys(langIds)
interface SelectorLangIdProps {
    value?: LangId;
    onChange?: (newLangId: LangId) => void;
}

export default function SelectorLangId({
    value: defaultValue,
    onChange
}: SelectorLangIdProps) {
    const [langId, setLangId] = useState<LangId|Blank>(defaultValue !== undefined ? defaultValue : blank);
    const [btnHover, setBtnHover] = useState(false);
    const [stop, setStop] = useState(false);

    const changeLangId = (e: React.MouseEvent<HTMLButtonElement>) => {
        const newLangId: LangId = e.currentTarget.innerHTML as LangId;
        setLangId(newLangId);
        setBtnHover(false);
        SelectorLangId.prototype.justClosed = true;
        onChange?.call(null, newLangId);
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
            {langIds.map((theId: LangId|Blank) => (theId !== blank &&
                <button key={theId} onClick={changeLangId}>{theId}</button>
            ))}
        </div>
    </div>);
}