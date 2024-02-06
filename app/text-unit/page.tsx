"use client"
import { useState } from 'react';
import SelectorLangId from '../dropdown-langid/selectorLangId';
import './layout.css';
import TextareaAutoResize from '../textarea-auto-resize/textareaAutoResize';

const tmpData = {
    "tid": "1hpfs",
    "spd": 1,
    "len": 0,
    "txt": "Salgo de mi habitación y veo la hora en un reloj del pasillo.",
    "lid": "es",
    "prg": "s5oa7",
    "crt": 1663589481,
    "mdf": 1663594289,
    "trs": [
      "I walk out of my room and check the time on a clock in the hallway.",
      "en"
    ],
    "pid": 4
};

export default function TextUnit() {
    const [text, setText] = useState('');
    const [trans, setTrans] = useState<string[]>([]);
    const playSound = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log('asdf');
        console.log(e);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.currentTarget;
        setText(value);
      };
    
    const addTranslation = (e: React.MouseEvent<HTMLButtonElement>) => {
        setTrans(oldTrans => [...oldTrans, '']);
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
                <SelectorLangId defaultSelectedKey='---' />
            </div>
        </div>
        <div className='translation-part'>
            {trans.map((value, index) => (<div key={index} className='text-and-langid'>
                    <TextareaAutoResize
                        className='text-part-trans'
                        value={value}
                        onChange={handleTextChange}
                    />
                    <SelectorLangId defaultSelectedKey='---' />
            </div>))}
            <div className='add-translation'>
                <button onClick={addTranslation}>+</button>
            </div>
        </div>
    </div>
    );
}