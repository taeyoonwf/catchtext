"use client"
import React, { useState } from 'react';
import './layout.css';

const langIds: string[] = ['de', 'en', 'es', 'fr', 'hi', 'id', 'it',
'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'zh'];

interface SelectorLangIdProps {
    defaultSelectedKey: string;
}

export default function SelectorLangId({defaultSelectedKey}: SelectorLangIdProps) {
    const [langId, setLangId] = useState(defaultSelectedKey);
    const [menuClosed, setMenuClosed] = useState(false);
    
    const changeLangId = (e: React.MouseEvent<HTMLButtonElement>) => {
        const newLangId = e.currentTarget.innerHTML;
        setLangId(newLangId);
        setMenuClosed(true);
        setTimeout(() => {
            setMenuClosed(false)
        }, 1);
    };

    return (<div className="sel-lang-id-dropdown">
        <button className="sel-lang-id-dropbtn">{langId}</button>
        <div className="sel-lang-id-dropdown-content">
            {!menuClosed && langIds.map((theId) => (
                <button key={theId} onClick={changeLangId}>{theId}</button>
            ))}
        </div>
    </div>);
}