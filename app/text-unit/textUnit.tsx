"use client"
import { useContext, useEffect, useState } from 'react';
import './layout.css';
import DropdownSelector from '../dropdown-selector/dropdownSelector';
import TextareaAutoResize, { TextareaAutoResizeProps } from '../textarea-auto-resize/textareaAutoResize';
import { SpeechSynthesizerContext } from '../speech-synthesizer/speechSynthesizer';
import { LanguageIdentifierContext } from '../language-identifier/languageIdentifier';
import { LanguageIdentifierResultType } from '../linguaWrapper';
import { Blank, BlankType, DefaultDialect, DialectIdType, DialectIds, LangIdType, LangIds, TextUnitDataUpdate } from '../baseTypes';

const LANG_ID_APPEAR = 0.01;
const LENGTH_THRESHOLD = 0.05;

export interface TextUnitProps {
    speed?: number;
    length?: number;
    text?: string;
    langId?: LangIdType;
    dialectId?: DialectIdType;
    translations?: string[];
    textId?: string;
    onChange?: (value: TextUnitDataUpdate) => void;
    visibleTrans?: boolean;
    textareaOption?: TextareaAutoResizeProps;
}

export default function TextUnit({
    text: textProp,
    langId: langIdProp,
    translations: translationsProp,
    speed: speedProp,
    length: lengthProp,
    dialectId: dialectIdProp,
    textId: textIdProp,
    onChange: onChangeProp,
    visibleTrans: visibleTransProp,
    textareaOption: textareaOptionProp,
}: TextUnitProps) {
    //const evenIndexItems = (e: string[]) => e.filter((value, index) => index % 2 === 0);
    //const oddIndexItems = (e: string[]) => e.filter((value, index) => index % 2 === 1);
    const convArrIntoPairs = (e: string[]) => e.reduce((acc: string[][], curr, index) => (index % 2 === 0 ? acc.push([curr]) : acc[acc.length - 1].push(curr), acc), []);
    const [text, setText] = useState(textProp !== undefined ? textProp : '');
    const [langId, setLangId] = useState<LangIdType|BlankType>(langIdProp !== undefined ? langIdProp : Blank);
    const [langIdOptions, setLangIdOptions] = useState<LangIdType[]>(langIdProp !== undefined ? [langIdProp] : []);
    const [dialectId, setDialectId] = useState<DialectIdType|BlankType>(dialectIdProp !== undefined ? dialectIdProp : Blank);
    const [trans, setTrans] = useState<string[][]>((translationsProp !== undefined && translationsProp.length >= 2) ? convArrIntoPairs(translationsProp) : [['', Blank]]);
    const [transLangIdOpts, setTransLangIdOpts] = useState<LangIdType[][]>([]);
    const [speed, setSpeed] = useState<number>(speedProp !== undefined ? speedProp : 1.0);
    const [length, setLength] = useState<number>(lengthProp !== undefined ? lengthProp : 0.0);
    const [isPlaying, setIsPlaying] = useState(false);
    const speechSynthesizer = useContext(SpeechSynthesizerContext);
    const languageIdentifier = useContext(LanguageIdentifierContext);

    useEffect(() => {
        // This function will be called after state has been updated
        // You can perform any action here that depends on the updated state
        // For example, you can make an API call, update local storage, etc.
        //console.log('State has been updated:', state);
        console.log(`textUnit useEffect! ${textIdProp}`);
        updateChanges();
    }, [text, langId, dialectId, trans, speed]);

    useEffect(() => {
        console.log(`textUnit useEffect for Props. ${textProp} ${langIdProp} ${speedProp}`);
        if (textProp !== undefined)
            setText(textProp);
        if (langIdProp !== undefined)
            setLangId(langIdProp);
        if (dialectIdProp !== undefined)
            setDialectId(dialectIdProp);
    }, [textProp, langIdProp, dialectIdProp, speedProp, textareaOptionProp]);

    const updateChanges = (newLength?: number) => {
        if (textIdProp === undefined)
            return;
        onChangeProp?.call(null, {
            paragraphKeyId: textIdProp,
            text,
            langId: (langId === Blank) ? 'en' : langId,
            dialectId: (dialectId === Blank) ? 'en-US' : dialectId,
            translations: trans,
            speed,
            length: (newLength !== undefined) ? newLength : length
        });
    }

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

        const voiceId = (dialectId !== Blank) ? dialectId : langId;
        setIsPlaying(true);
        speechSynthesizer.PlayText(text, voiceId, speed, (forcedStop, playingTime) => {
            if (!forcedStop) {
                const relativeError = Math.abs(length - playingTime) / playingTime;
                console.log(`length: ${length}, playingTime: ${playingTime}, relativeError: ${relativeError}`);
                if (relativeError > LENGTH_THRESHOLD)
                    updateChanges(playingTime);
                setLength(playingTime);
            }
            setIsPlaying(false);
        });
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.currentTarget;
        if (value !== text) {
            console.log(`setText h1`);
            setText(value);
            setLength(0.0);
            languageIdentifier.Query!(value, (langAndProbs: LanguageIdentifierResultType) => {
                console.log(langAndProbs);
                if (langAndProbs.length > 0) {
                    console.log(langAndProbs[0].language as LangIdType);
                }
                const newLangIdCands: LangIdType[] =
                    langAndProbs.filter((e) => LangIds.includes(e.language as LangIdType) && e.value >= LANG_ID_APPEAR)
                        .map((e) => e.language as LangIdType);
                console.log(langAndProbs);
                console.log(newLangIdCands);
                setLangIdOptions(newLangIdCands);

                //const updateNewLangId = newLangIdCands.length > 0 && langId !== newLangIdCands[0];
                if (newLangIdCands.length > 0) {
                    const newLangId = newLangIdCands[0];
                    if (langId !== newLangId) {
                        setLangId(newLangId);
                        setDialectId(DefaultDialect[newLangId] !== undefined ? DefaultDialect[newLangId]! : Blank);
                    }
                }
                else {
                    setLangId(Blank);
                    setDialectId(Blank);
                }
            });
        }
    };

    const handleTransTextChange = (index: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.currentTarget;
        const newTrans = [...trans];
        if (newTrans[index][0] !== value) {
            newTrans[index][0] = value;
            setTrans(newTrans);
            languageIdentifier.Query!(value, (langAndProbs: LanguageIdentifierResultType) => {
                const newLangIdCands: LangIdType[] =
                    langAndProbs.filter((e) => LangIds.includes(e.language as LangIdType) && e.value >= LANG_ID_APPEAR)
                        .map((e) => e.language as LangIdType);
                const newTrans = [...trans];
                newTrans[index][1] = (newLangIdCands.length > 0) ? newLangIdCands[0] : Blank;
                setTrans(newTrans);
                const newTransLangIdOpts = [...transLangIdOpts];
                newTransLangIdOpts[index] = newLangIdCands;
                setTransLangIdOpts(newTransLangIdOpts);
            });
        }
        console.log(e.currentTarget);
        console.log(index);
        //if (value !== )
    };

    const addTranslation = (e: React.MouseEvent<HTMLButtonElement>) => {
        setTrans(oldTrans => [...oldTrans, ['', Blank]]);
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
            setDialectId((DefaultDialect[newKey] !== undefined) ? DefaultDialect[newKey]! : Blank);
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
        <div className={visibleTransProp === false ? 'text-part-extended' : 'text-part'}>
            <div className='text-and-langid'>
                <TextareaAutoResize
                    {...textareaOptionProp}
                    className='text-part-text'
                    value={text}
                    onChange={handleTextChange}
                    placeholder='Base Text'
                />
                <DropdownSelector<LangIdType, BlankType> blankKey={Blank} keys={langIdOptions} selectedKey={langId} onChange={handleLangId}/>
            </div>
            <div className='text-and-langid'>
                <div className='sound-length'>
                    <span>{`${length <= 0 ? '?.?s' : '≈ ' + length.toFixed(1) + 's'}`}</span>
                </div>
                <div className='speech-option'>
                    <DropdownSelector<DialectIdType, BlankType>
                        blankKey={Blank}
                        keys={DialectIds.filter(e => e.startsWith(langId))}
                        selectedKey={dialectId}
                        onChange={handleDialect}
                    />
                </div>
                <div className='playback-speed'>
                    <span>Speed {speed.toFixed(1)}</span>
                    <input type="range" min="0.6" max="1.6" value={speed} step="0.1" id="rate" onChange={handleSpeed}/>
                </div>
            </div>
        </div>
        {visibleTransProp !== false &&
            <div className='translation-part'>
                {trans.map((value, index) => (<div key={index} className='text-and-langid'>
                    <TextareaAutoResize
                        className='text-part-trans'
                        value={value[0]}
                        onChange={handleTransTextChange(index)}
                        placeholder={`Translation #${index + 1}`}
                    />
                    <DropdownSelector
                        blankKey={Blank}
                        keys={transLangIdOpts[index] !== undefined ? transLangIdOpts[index] : []}
                        selectedKey={value[1] as LangIdType}
                    />
                </div>))}
                <div className='add-button-panel'>
                    <button className='add-trans-button' onClick={addTranslation}>+</button>
                </div>
            </div>
        }
    </div>
    );
}