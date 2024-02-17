"use client"
import React, { useState } from 'react';
import './layout.css';
import { Blank, BlankType, LangIdType, LangIds } from '../baseTypes';

interface SelectorLangIdProps {
    value?: LangIdType;
    onChange?: (newLangId: LangIdType) => void;
}

export default function SelectorLangId({
    value: defaultValue,
    onChange
}: SelectorLangIdProps) {
    const [langId, setLangId] = useState<LangIdType|BlankType>(defaultValue !== undefined ? defaultValue : Blank);
    const [btnHover, setBtnHover] = useState(false);
    const [stop, setStop] = useState(false);

    const changeLangId = (e: React.MouseEvent<HTMLButtonElement>) => {
        const newLangId: LangIdType = e.currentTarget.innerHTML as LangIdType;
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
            {LangIds.map((theId: LangIdType|BlankType) => (theId !== Blank &&
                <button key={theId} onClick={changeLangId}>{theId}</button>
            ))}
        </div>
    </div>);
}