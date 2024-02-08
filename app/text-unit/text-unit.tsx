"use client"
import { useState } from 'react';
import SelectorLangId from '../dropdown-langid/selectorLangId';
import './layout.css';
import TextareaAutoResize from '../textarea-auto-resize/textareaAutoResize';

export interface TextUnitProps {
    speed?: number;
    length?: number;
    text?: string;
    langId?: string;
    translations?: string[];
}

export default function TextUnit({
    text: textProp,
    langId: langIdProp,
    translations: translationsProp,
    speed: speedProp,
    length: lengthProp
}: TextUnitProps) {
    //const evenIndexItems = (e: string[]) => e.filter((value, index) => index % 2 === 0);
    //const oddIndexItems = (e: string[]) => e.filter((value, index) => index % 2 === 1);
    const convArrIntoPairs = (e: string[]) => e.reduce((acc: string[][], curr, index) => (index % 2 === 0 ? acc.push([curr]) : acc[acc.length - 1].push(curr), acc), []);
    const [text, setText] = useState(textProp !== undefined ? textProp : '');
    const [langId, setLangId] = useState(langIdProp !== undefined ? langIdProp : '---');
    const [trans, setTrans] = useState<string[][]>(translationsProp !== undefined ? convArrIntoPairs(translationsProp) : [['', '---']]);
    const [speed, setSpeed] = useState<number>(speedProp !== undefined ? speedProp : 1.0);
    const [length, setLength] = useState<number>(lengthProp !== undefined ? lengthProp : 0.0);

    const playSound = (e: React.MouseEvent<HTMLButtonElement>) => {
        // console.log('asdf');
        // console.log(e);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.currentTarget;
        setText(value);
      };
    
    const addTranslation = (e: React.MouseEvent<HTMLButtonElement>) => {
        setTrans(oldTrans => [...oldTrans, ['', '---']]);
    }

    const handleSpeed = (e:React.ChangeEvent<HTMLInputElement>) => {
        //const { value } = e.target.value;
        setSpeed(Number.parseFloat(e.target.value));
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
                <SelectorLangId value={langId} onChange={(newLangId) => setLangId(newLangId)}/>
            </div>
            <div className='text-and-langid'>
                <div className='sound-length'>
                    <span>{`${length <= 0 ? '?.?s' : '≈ ' + length.toFixed(1) + 's'}`}</span>
                </div>
                <div className='speech-option'>
                    <SelectorLangId value={langId} />
                </div>
                <div className='playback-speed'>
                    <span>Speed {speed.toFixed(1)}</span>
                    <input type="range" min="0.5" max="1.5" value={speed} step="0.1" id="rate" onChange={handleSpeed}/>
                </div>
            </div>
        </div>
        <div className='translation-part'>
            {trans.map((value, index) => (<div key={index} className='text-and-langid'>
                    <TextareaAutoResize
                        className='text-part-trans'
                        value={value[0]}
                        onChange={handleTextChange}
                    />
                    <SelectorLangId value={value[1]} />
            </div>))}
            <div className='add-button-panel'>
                <button className='add-trans-button' onClick={addTranslation}>+</button>
            </div>
        </div>
    </div>
    );
}