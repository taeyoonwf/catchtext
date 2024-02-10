"use client"
import { useContext, useEffect, useState } from 'react';
import './layout.css';
import DropdownSelector from '../dropdown-selector/dropdownSelector';
import TextareaAutoResize from '../textarea-auto-resize/textareaAutoResize';
import { SpeechSynthesizerContext } from '../speech-synthesizer/speechSynthesizer';
import { LanguageIdentifierContext } from '../language-identifier/languageIdentifier';
import { LanguageIdentifierResultType } from '../linguaWrapper';
import { LangId } from '../dropdown-langid/selectorLangId';

const allLangIds = [
    'de', 'en', 'es', 'fr', 'hi', 'id', 'it',
    'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'zh'] as const;
const blank = '---' as const;
const dialectIds = ['en-US', 'en-GB-0', 'en-GB-1', 'es-ES', 'es-US', 'zh-CN', 'zh-HK', 'zh-TW'] as const;
export type LangIdType = typeof allLangIds[number];
export type BlankType = typeof blank;
export type DialectIdType = typeof dialectIds[number];
const defaultDialect: {[key in LangIdType]?: DialectIdType } = {
    en: 'en-US',
    es: 'es-ES',
    zh: 'zh-CN'
};
const LANG_ID_APPEAR = 0.01;

export type TextUnitData = {
    spd: number;
    len: number;
    txt: string;
    lid: LangIdType;
    did: DialectIdType;
    trs: string[];
    tid: string;
    prg: string;
    crt: number;
    mdf: number;
    pid: number;
};

export interface TextUnitProps {
    speed?: number;
    length?: number;
    text?: string;
    langId?: LangIdType;
    dialectId?: DialectIdType;
    translations?: string[];
}

export default function TextUnit({
    text: textProp,
    langId: langIdProp,
    translations: translationsProp,
    speed: speedProp,
    length: lengthProp,
    dialectId: dialectIdProp
}: TextUnitProps) {
    //const evenIndexItems = (e: string[]) => e.filter((value, index) => index % 2 === 0);
    //const oddIndexItems = (e: string[]) => e.filter((value, index) => index % 2 === 1);
    const convArrIntoPairs = (e: string[]) => e.reduce((acc: string[][], curr, index) => (index % 2 === 0 ? acc.push([curr]) : acc[acc.length - 1].push(curr), acc), []);
    const [text, setText] = useState(textProp !== undefined ? textProp : '');
    const [langId, setLangId] = useState<LangIdType|BlankType>(langIdProp !== undefined ? langIdProp : blank);
    const [langIdOptions, setLangIdOptions] = useState<LangIdType[]>(langIdProp !== undefined ? [langIdProp] : []);
    const [dialectId, setDialectId] = useState<DialectIdType|BlankType>(dialectIdProp !== undefined ? dialectIdProp : blank);
    const [trans, setTrans] = useState<string[][]>(translationsProp !== undefined ? convArrIntoPairs(translationsProp) : [['', blank]]);
    const [speed, setSpeed] = useState<number>(speedProp !== undefined ? speedProp : 1.0);
    const [length, setLength] = useState<number>(lengthProp !== undefined ? lengthProp : 0.0);
    const [isPlaying, setIsPlaying] = useState(false);
    const speechSynthesizer = useContext(SpeechSynthesizerContext);
    const languageIdentifier = useContext(LanguageIdentifierContext);

    const playSound = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(speechSynthesizer.PlayText);
        console.log(speechSynthesizer.Stop);
        console.log(speechSynthesizer.IsPlaying);

        if (isPlaying) {
            speechSynthesizer.Stop!();
            return;
        }
        if (speechSynthesizer.PlayText === undefined)
            return;

        const voiceId = (dialectId !== blank) ? dialectId : langId;
        setIsPlaying(true);
        speechSynthesizer.PlayText(text, voiceId, speed, (forcedStop, playingTime) => {
            if (!forcedStop)
                setLength(playingTime);
            setIsPlaying(false);
        });
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.currentTarget;
        if (value !== text) {
            setText(value);
            languageIdentifier.Query!(value, (langAndProbs: LanguageIdentifierResultType) => {
                const newLangIdCands: LangIdType[] =
                    langAndProbs.filter((langAndProb) => langAndProb.value >= LANG_ID_APPEAR)
                        .map((langAndProb) => langAndProb.language as LangIdType);
                console.log(langAndProbs);
                console.log(newLangIdCands);
                setLangId(newLangIdCands.length > 0 ? newLangIdCands[0] : blank);
                setLangIdOptions(newLangIdCands);
            });
        }
    };
    
    const addTranslation = (e: React.MouseEvent<HTMLButtonElement>) => {
        setTrans(oldTrans => [...oldTrans, ['', blank]]);
    }

    const handleSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
        //const { value } = e.target.value;
        setSpeed(Number.parseFloat(e.target.value));
    }

    const handleLangId = (newKey: LangIdType) => {
        setLangId(newKey);
        if (!dialectId.startsWith(newKey)) {
            //console.log(`newKey : ${newKey}`);
            //console.log(`dialectId : ${dialectId}`);
            //console.log(`dialectIds : ${dialectIds[newKey]}`);
            //console.log(`newDialect : ${dialectIds[newKey][0]}`);
            //console.log(`defaultDialect[newKey] : ${defaultDialect[newKey]}`);
            setDialectId((defaultDialect[newKey] !== undefined) ? defaultDialect[newKey]! : blank);
        }
    }

    const handleDialect = (newKey: DialectIdType) => {
        setDialectId(newKey);
    }

    return (
    <div className='text-unit-bg'>
        <button onClick={playSound}
                        className='play-btn'>
                        {`${!isPlaying && text.length > 0 ? '▶' : '■'}`}
                    </button>
        <div className='text-part'>
            <div className='text-and-langid'>
                <TextareaAutoResize
                    className='text-part-text'
                    value={text}
                    onChange={handleTextChange}
                />
                <DropdownSelector<LangIdType, BlankType> blankKey={blank} keys={langIdOptions} selectedKey={langId} onChange={handleLangId}/>
            </div>
            <div className='text-and-langid'>
                <div className='sound-length'>
                    <span>{`${length <= 0 ? '?.?s' : '≈ ' + length.toFixed(1) + 's'}`}</span>
                </div>
                <div className='speech-option'>
                    <DropdownSelector<DialectIdType, BlankType>
                        blankKey={blank}
                        keys={dialectIds.filter(e => e.startsWith(langId))}
                        selectedKey={dialectId}
                        onChange={handleDialect}
                    />
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
                    <DropdownSelector blankKey={blank} keys={allLangIds} selectedKey={value[1] as LangIdType} />
            </div>))}
            <div className='add-button-panel'>
                <button className='add-trans-button' onClick={addTranslation}>+</button>
            </div>
        </div>
    </div>
    );
}