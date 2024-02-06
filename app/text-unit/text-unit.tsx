"use client"
import { useState } from 'react';
import SelectorLangId from '../dropdown-langid/selectorLangId';
import './layout.css';
import TextareaAutoResize from '../textarea-auto-resize/textareaAutoResize';

interface TextUnitProps {
    speed?: number;
    length?: number;
    defaultText?: string;
    defaultLangId?: string;
    translations?: string[];
}

export default function TextUnit({defaultText, defaultLangId, translations}: TextUnitProps) {
    //const evenIndexItems = (e: string[]) => e.filter((value, index) => index % 2 === 0);
    //const oddIndexItems = (e: string[]) => e.filter((value, index) => index % 2 === 1);
    const convArrIntoPairs = (e: string[]) => e.reduce((acc: string[][], curr, index) => (index % 2 === 0 ? acc.push([curr]) : acc[acc.length - 1].push(curr), acc), []);
    const [text, setText] = useState(defaultText !== undefined ? defaultText : '');
    const [langId, setLangId] = useState(defaultLangId !== undefined ? defaultLangId : '---');
    const [trans, setTrans] = useState<string[][]>(translations !== undefined ? convArrIntoPairs(translations) : [['', '---']]);
    const playSound = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log('asdf');
        console.log(e);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.currentTarget;
        setText(value);
      };
    
    const addTranslation = (e: React.MouseEvent<HTMLButtonElement>) => {
        setTrans(oldTrans => [...oldTrans, ['', '---']]);
    }

    return (
    <div className='text-unit-bg'>
        <button onClick={playSound}
                        className='play-btn'>
                        ▶
                    </button>
        <div className='text-part'>
            <div className='text-and-langid'>
                <TextareaAutoResize
                    className='text-part-text'
                    value={text}
                    onChange={handleTextChange}
                />
                <SelectorLangId defaultSelectedKey={langId} onChange={(newLangId) => setLangId(newLangId)}/>
            </div>
        </div>
        <div className='translation-part'>
            {trans.map((value, index) => (<div key={index} className='text-and-langid'>
                    <TextareaAutoResize
                        className='text-part-trans'
                        value={value[0]}
                        onChange={handleTextChange}
                    />
                    <SelectorLangId defaultSelectedKey={value[1]} />
            </div>))}
            <div className='add-translation'>
                <button onClick={addTranslation}>+</button>
            </div>
        </div>
    </div>
    );
}