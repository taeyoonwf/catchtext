"use client"
import React, { ChangeEventHandler, useState } from 'react';
import './layout.css';

//export const langIds = ['de', 'en', 'es', 'fr', 'hi', 'id', 'it',
//'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'zh'] as const;
//export const blank = '---' as const;

//export type LangId = typeof langIds[number];
//export type Blank = typeof blank;

//const dialectIds: string[] = ['en-GB-0', 'en-GB-1', 'en-US', 'es-ES', 'es-US', 'zh-CN', 'zh-HK', 'zh-TW'];

// Object.keys(langIds)
interface DropdownSelectorProps<Keys extends string, Blank extends string> {
    blankKey: Blank;
    selectedKey?: Keys;
    keys: readonly Keys[];
    onChange?: (newKey: Keys) => void;
}

export default function DropdownSelector<Keys extends string, Blank extends string>({
    blankKey: blankKeyProp,
    selectedKey: selectedKeyProp,
    keys: keysProp,
    onChange
}: DropdownSelectorProps<Keys, Blank>) {
    const [key, setKey] = useState<Keys|Blank>(selectedKeyProp !== undefined && keysProp.includes(selectedKeyProp) ? selectedKeyProp : blankKeyProp);
    const [btnHover, setBtnHover] = useState(false);
    const [stop, setStop] = useState(false);

    const changeLangId = (e: React.MouseEvent<HTMLButtonElement>) => {
        const newKey: Keys = e.currentTarget.innerHTML as Keys;
        setKey(newKey);
        setBtnHover(false);
        DropdownSelector.prototype.justClosed = true;
        onChange?.call(null, newKey);
    };

    return (
    <div className="sel-dropdown"
        onMouseMove={() => {
            setBtnHover(!stop && DropdownSelector.prototype.justClosed != true);
            DropdownSelector.prototype.justClosed = false;
        }}
        onMouseOut={() => {
            setBtnHover(false);
            setStop(false);
        }}
        //onMouseEnter={() => console.log('mouse enter')}
        //onMouseLeave={() => console.log('mouse leave')}
    >
        <button className="sel-dropbtn"
            onClick={() => {
                setStop(true);
                DropdownSelector.prototype.justClosed = true;
            }}
        >
            {key}
        </button>
        <div className={`${(btnHover && !stop) ? "display-block" : "display-none"} sel-dropdown-content`}>
            {keysProp.map((theId: Keys|Blank) => (theId !== blankKeyProp &&
                <button key={theId} onClick={changeLangId}>{theId}</button>
            ))}
        </div>
    </div>);
}