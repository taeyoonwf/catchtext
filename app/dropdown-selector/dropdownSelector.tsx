"use client"
import React, { useEffect, useState } from 'react';
import './layout.css';

let DropdownSelectorJustClosed = false;

interface DropdownSelectorProps<Keys extends string, Blank extends string> {
    blankKey: Blank;
    selectedKey?: Keys|Blank;
    keys: readonly Keys[];
    onChange?: (newKey: Keys) => void;
}

export default function DropdownSelector<Keys extends string, Blank extends string>({
    blankKey: blankKeyProp,
    selectedKey: selectedKeyProp,
    keys: keysProp,
    onChange: onChangeProp
}: DropdownSelectorProps<Keys, Blank>) {
    const [key, setKey] = useState<Keys|Blank>(selectedKeyProp !== undefined ? selectedKeyProp : blankKeyProp);
    const [keyOptions, setKeyOptions] = useState<readonly Keys[]>(keysProp);
    const [btnHover, setBtnHover] = useState(false);
    const [stop, setStop] = useState(false);

    useEffect(() => {
        /*console.log(`useEffect in dropdownSelector`);
        console.log(`btnHover : ${btnHover}`);
        console.log(`stop : ${stop}`);
        console.log(`keysProp : ${keysProp}`);
        console.log(`selectedKeyProp : ${selectedKeyProp}`);
        */
        if (selectedKeyProp !== undefined) {
            setKey(selectedKeyProp);
        }
        setKeyOptions(keysProp);
    }, [keysProp, selectedKeyProp]);

    const changeLangId = (e: React.MouseEvent<HTMLButtonElement>) => {
        const newKey: Keys = e.currentTarget.innerHTML as Keys;
        //console.log(`oldKey : ${key}`);
        //console.log(`newKey : ${newKey}`);
        setKey(newKey);
        setBtnHover(false);
        DropdownSelectorJustClosed = true;
        onChangeProp?.call(null, newKey);
    };

    return (
    <div className="sel-dropdown"
        onMouseMove={() => {
            setBtnHover(!stop && DropdownSelectorJustClosed != true);
            DropdownSelectorJustClosed = false;
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
                DropdownSelectorJustClosed = true;
            }}
        >
            {key}
        </button>
        <div className={`${(btnHover && !stop) ? "display-block" : "display-none"} sel-dropdown-content`}>
            {keyOptions.map((theId: Keys|Blank) => (theId !== blankKeyProp &&
                <button key={theId} onClick={changeLangId}>{theId}</button>
            ))}
        </div>
    </div>);
}