'use client'
import './layout.css';
import { CSSProperties, ChangeEvent, useContext, useEffect, useState } from 'react';
import { Blank, BlankType, DefaultDialect, LangIdType, LangIds, TextUnitDataUpdate, colorSeries } from '../baseTypes';
import DropdownSelector from '../dropdown-selector/dropdownSelector';
import { LanguageIdentifierContext } from '../language-identifier/languageIdentifier';
import TextUnit, { TextUnitProps } from '../text-unit/textUnit';
import TextareaAutoResize from '../textarea-auto-resize/textareaAutoResize';
import segment from 'sentencex';
import { LanguageIdentifierResultType } from '../linguaWrapper';
import DropdownMenu from '../dropdown-menu/dropdownMenu';
import TextTemplates from './text-templates/textTemplates';
import { NormalProcessor, TemplateAnnotation, TemplateProcessor } from './text-templates/templates/normal';
import { DialectWithGender } from '../baseUtils';

export interface DivTextArgs {
  divider: string;
  sentence: string;
  senBgColor: string;
  divSelColor: string;
  senSelColor: string;
  annotation?: TemplateAnnotation;
}

enum MoveDivider {
  NoAction,
  MoveStarted,
  CheckedStartIndex,
  WrongStartingPoint,
}
let moveDividerStage: MoveDivider = MoveDivider.NoAction;
const TRANSP = 'transparent';
let templateProc: TemplateProcessor = NormalProcessor;

export interface AddTextMainProps {
  paragraphKey: string,
  text?: string,
  onTextChange?: (value: string) => void;
  onSave?: (textSet: DivTextArgs[],
    textUnitValues?: TextUnitDataUpdate,
  ) => void;
}

export default function AddTextMain({
  paragraphKey: paragraphKeyProp,
  text: textProp,
  onTextChange: onTextChangeProp,
  onSave: onSaveProp,
}: AddTextMainProps) {
  const [text, setText] = useState(textProp ?? '');
  const [langId, setLangId] = useState<LangIdType|BlankType>(Blank);
  const [langIdOptions, setLangIdOptions] = useState<LangIdType[]>([]);
  const [divText, setDivText] = useState<DivTextArgs[]>([]);
  const languageIdentifier = useContext(LanguageIdentifierContext);
  const [textUnitProps, setTextUnitProps] = useState<TextUnitProps>({text: ' '});
  const [playingQueue, setPlayingQueue] = useState<number[]>([]);
  const [textUnitValues, setTextUnitValues] = useState<TextUnitDataUpdate>();
  //const [templateProc, setTemplateProc] = useState(null);

  const onAllMouseUp = (e: any) => moveDividerDone(e);
  const menuForDivText = ['▶', '/', 'x']

  useEffect(() => {
    console.log(`textProp in AddTextMain: "${textProp}"`);
    if (textProp !== undefined)
      handleTextChange(textProp);
  }, [textProp]);

  useEffect(() => {
    document.addEventListener('mouseup', onAllMouseUp);
    return () => {
      document.removeEventListener('mouseup', onAllMouseUp);
    };
  });

  useEffect(() => {
    //console.log("playing queue changed!");
    if (textUnitProps.autoPlay) {
      setTextUnitProps((prev) => ({...prev, autoPlay: false}))
    }
    if (playingQueue.length === 0) {
      return;
    }

    const e = divText[playingQueue[0]];
    const currPlayingQueue = JSON.stringify(playingQueue);
    //console.log(`play #${playingQueue[0]} sound`);
    console.log(e);
    setTimeout(
      () => setTextUnitProps((prev) => ({
        ...prev,
        text: e.sentence,
        textareaOption: {backgroundColor: e.senBgColor},
        autoPlay: true,
        ...(typeof e.annotation?.isFemale === 'boolean' ? {dialectId: DialectWithGender(langId, e.annotation.isFemale)} : {}),
        onPlayFinished: () => {
          if (currPlayingQueue === JSON.stringify(playingQueue)) {
            //console.log(playingQueue.slice(1));
            setPlayingQueue((prev) => prev.slice(1));
          }
        }
      }))
    , 250);
  }, [playingQueue]);

  useEffect(() => {
    setPlayingQueue([]);
  }, [divText]);

  const moveDividerBegin = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    console.log('moving start');
    moveDividerStage = MoveDivider.MoveStarted;
  }

  const moveDividerWrongStartingPoint = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    moveDividerStage = MoveDivider.WrongStartingPoint;
  }

  const moveDivider = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    //const theSpan: JSX.Element = e.target;
    if (e.buttons === 1 && moveDividerStage == MoveDivider.MoveStarted) {
      console.log("moving divider");
      const sel = window.getSelection();
      if (sel !== null) { // && checkAnchor) {
        //console.log(sel.anchorNode);
        //console.log(sel.focusNode);
        //const anchorNodeIndex = Array.prototype.indexOf.call(sel.anchorNode?.parentNode?.parentNode?.childNodes, sel.anchorNode?.parentNode);
        //console.log("anchorNodeIndex : " + anchorNodeIndex);
  
        moveDividerStage = MoveDivider.CheckedStartIndex;
        //checkAnchor = false;
        //setSelDivTextIndex(Math.floor((anchorNodeIndex + 1) * 0.5));
        
        const divIndex = selectionStartIndex(sel); // Math.floor((anchorNodeIndex + 1) * 0.5);
        const colorPrev = divText[divIndex - 1].senBgColor;
        const colorNext = divText[divIndex].senBgColor;
        setDivText((prev) => prev.map((e, idx) => (
          {
            ...e,
            divSelColor: (idx < divIndex) ? colorNext : ((idx == divIndex) ? TRANSP : colorPrev),
            senSelColor: (idx < divIndex) ? colorNext : colorPrev,
          }
        )));
        console.log('anchor check finish ' + moveDividerStage);
      }
    }
  }

  const divideDivText = (index: number, offset: number) => {
    const s = divText[index].sentence;
    const len = s.length;
    const prev = s.substring(0, offset).trim();
    const next = s.substring(offset).trim();
    const divStr = s.substring(prev.length, offset)
      + s.substring(offset, len - next.length);
    return [
      ...divText.slice(0, index),
      {
        ...divText[index],
        divider: divText[index].divider,
        sentence: prev,
      },
      {
        ...divText[index],
        divider: divStr,
        sentence: next,
      },
      ...divText.slice(index + 1)
    ];
  }

  const mergePartOfDivTextArr = (fromIndex: number, toIndex: number, mergeColorFromIndex: boolean, arr: DivTextArgs[]) => {
    if (fromIndex === toIndex) {
      return;
    }
    console.log(`fromIndex: ${fromIndex}, toIndex: ${toIndex}`);
    const mergedSentenceList = [arr[fromIndex].sentence,
      ...arr.slice(fromIndex + 1, toIndex).reduce((acc: string[], curr, _) => (acc.push(curr.divider + curr.sentence), acc), [])];
    const mergedSentence = mergedSentenceList.join('');
    const newDivText = [
      ...arr.slice(0, fromIndex).map((e, _) => (
        {...e, divSelColor: TRANSP, senSelColor: TRANSP}
      )),
      {
        divider: arr[fromIndex].divider,
        sentence: mergedSentence,
        senBgColor: mergeColorFromIndex ? arr[fromIndex].senSelColor : arr[toIndex - 1].senSelColor,
        divSelColor: TRANSP,
        senSelColor: TRANSP,
        annotation: arr[fromIndex].annotation,
      },
      ...arr.slice(toIndex, arr.length).map((e, _) => (
        {...e, divSelColor: TRANSP, senSelColor: TRANSP}
      ))
    ];
    console.log(newDivText);
    setDivText(newDivText);

    setTextUnitProps((prev) => ({...prev,
      text: newDivText[0].sentence,
      length: 0,
      textareaOption: {backgroundColor: newDivText[0].senBgColor}
    }));
  }

  const selectionStartIndex = (sel: Selection) => {
    const anchorNodeIndex = Array.prototype.indexOf.call(sel.anchorNode?.parentNode?.parentNode?.childNodes, sel.anchorNode?.parentNode);
    const focusNodeIndex = Array.prototype.indexOf.call(sel.focusNode?.parentNode?.parentNode?.childNodes, sel.focusNode?.parentNode);
    if (focusNodeIndex < anchorNodeIndex || focusNodeIndex == anchorNodeIndex && sel.focusOffset <= sel.anchorOffset)
      return Math.floor((anchorNodeIndex + 1) * 0.5);
    return Math.floor(anchorNodeIndex * 0.5);
  }

  const moveDividerDone = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    //console.log("moving done");
    const sel = window.getSelection();
    //console.log(sel);
    //console.log(moveDividerStage);
    if (sel !== null && moveDividerStage == MoveDivider.WrongStartingPoint) {
      moveDividerStage = MoveDivider.NoAction;
      sel.empty();
      console.log(window.getSelection());
    }
    else if (sel !== null && moveDividerStage == MoveDivider.CheckedStartIndex) {
      console.log(sel.anchorNode);
      console.log(sel.focusNode);
      const anchorNodeIndex = Array.prototype.indexOf.call(sel.anchorNode?.parentNode?.parentNode?.childNodes, sel.anchorNode?.parentNode);
      const focusNodeIndex = Array.prototype.indexOf.call(sel.focusNode?.parentNode?.parentNode?.childNodes, sel.focusNode?.parentNode);
      console.log("anchorNodeIndex focusNodeIndex " + anchorNodeIndex + ", " + focusNodeIndex);

      if (focusNodeIndex % 2 == 0) {
        if (anchorNodeIndex != focusNodeIndex) {
          const startIndex = Math.floor((anchorNodeIndex + (focusNodeIndex < anchorNodeIndex ? 1 : 0)) * 0.5);
          //const startIndex = Math.floor((anchorNodeIndex + 1) * 0.5);
          const endIndex = focusNodeIndex / 2;
          // console.log(`endIndex: ${endIndex}, startIndex: ${startIndex}`);
          let fromIndex = (endIndex < startIndex) ? endIndex : startIndex - 1;
          let toIndex = (endIndex < startIndex) ? startIndex + 1 : endIndex;
          mergePartOfDivTextArr(fromIndex, toIndex, endIndex < startIndex, divText);
        }
        else {
          setDivText((prev) => prev.map((e) => (
            {...e, divSelColor: TRANSP, senSelColor: TRANSP}
          )));
        }
      }
      else {
        if (focusNodeIndex < anchorNodeIndex || focusNodeIndex == anchorNodeIndex && sel.focusOffset <= sel.anchorOffset) {
          const startIndex = selectionStartIndex(sel);
          console.log(`went back`);
          const endIndex = Math.floor(focusNodeIndex * 0.5);
          if (sel.focusOffset == 0)
            mergePartOfDivTextArr(endIndex, startIndex + 1, true, divText);
          else if (focusNodeIndex != anchorNodeIndex || sel.focusOffset != sel.anchorOffset) {
            const arr = divideDivText(endIndex, sel.focusOffset);
            console.log(arr);
            mergePartOfDivTextArr(endIndex + 1, startIndex + 2, true, arr);
            //divideAndMergePartOfDivTextBack(endIndex, startIndex + 1, true);
          }
          else {
            setDivText((prev) => prev.map((e) => (
              {...e, divSelColor: TRANSP, senSelColor: TRANSP}
            )));
          }
        }
        else {
          const startIndex = selectionStartIndex(sel);
          console.log(`went forward`);
          const endIndex = Math.floor(focusNodeIndex * 0.5);
          console.log(`endIndex : ${endIndex}, divText[endIndex].sentence.length: ${divText[endIndex].sentence.length}`);
          if (sel.focusOffset === divText[endIndex].sentence.length)
            mergePartOfDivTextArr(startIndex - 1, endIndex + 1, false, divText);
          else if (focusNodeIndex != anchorNodeIndex || sel.focusOffset != sel.anchorOffset) {
            const arr = divideDivText(endIndex, sel.focusOffset);
            mergePartOfDivTextArr(startIndex - 1, endIndex + 1, false, arr);
          }
        }
      }

      moveDividerStage = MoveDivider.NoAction;
      sel.empty();
    }
  }

  const refreshSegmentedText = (langId: LangIdType|BlankType, value: string) => {
    const sentencesRaw: string[] = segment(langId !== Blank ? langId : 'en', value)
      .map((s, index) => s.trim())
      .filter((s, index) => s.length > 0);
    let value_index = 0;
    //let sent_index = 0;
    const dividersRaw: string[] = [];

    //while (true) {
    for (let sent_index = 0; sent_index < sentencesRaw.length; sent_index++) {
      const curr = value.indexOf(sentencesRaw[sent_index], value_index);
      dividersRaw.push(value.substring(value_index, curr));
      value_index = curr + sentencesRaw[sent_index].length;
    }
    //dividers.push(value.substring(value_index, value.length));

    //if ()
    console.log(sentencesRaw);
    console.log(dividersRaw);
    console.log(templateProc);
    //const ret = (templateProcParam !== undefined) ? 
    //  templateProcParam(sentencesRaw, dividersRaw) : NormalProcessor(sentencesRaw, dividersRaw);
    const ret = templateProc(sentencesRaw, dividersRaw);
    const sentences = ret[0];
    const dividers = ret[1];
    const annots = ret[2];
    console.log(sentences);
    console.log(dividers);
    console.log(annots);

    setDivText(sentences.map((s, index) => ({
      divider: dividers[index],
      sentence: s,
      senBgColor: colorSeries[index % colorSeries.length],
      divSelColor: TRANSP,
      senSelColor: TRANSP,
      annotation: annots?.[index] ?? undefined,
    } as DivTextArgs)));

    console.log(`dialectId : ${DefaultDialect[langId as LangIdType]}`);
    setTextUnitProps((prev) => ({...prev,
      visibleTrans: false,
      text: sentences.length > 0 ? sentences[0] : ' ',
      langId: langId as any,
      dialectId: DefaultDialect[langId as LangIdType],
      length: 0,
      textareaOption: {backgroundColor: sentences.length > 0 ? colorSeries[0] : TRANSP}
    }));
  }

  //const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
  //  const { value } = e.currentTarget;
  const handleTextChange = (value: string) => {
    if (text === value)
      return;

    setText(value);
    onTextChangeProp?.call(null, value);
    console.log('handleTextChange : ' + value);
    languageIdentifier.Query!(value, (langAndProbs: LanguageIdentifierResultType) => {
      const newLangIdCands: LangIdType[] =
        langAndProbs.filter((e) => LangIds.includes(e.language as LangIdType) && e.value > 0)
          .map((e) => e.language as LangIdType);
      console.log(`newLangIdCands`);
      console.log(newLangIdCands);
      console.log(langAndProbs);
      setLangIdOptions(newLangIdCands);
      if (newLangIdCands.length > 0) {
        const newLangId = newLangIdCands[0];
        setLangId(newLangId);
        refreshSegmentedText(newLangId, value);
      }
      else {
        console.log(`use Blank 0`);
        setLangId(Blank);
        console.log(`use Blank 1`);
        refreshSegmentedText(Blank, value);
      }
    });
  }

  const handleLangId = (newKey: LangIdType) => {
    setLangId(newKey);
    //throw new Error('Function not implemented.');
    refreshSegmentedText(newKey, text);
  }

  const playAll = () => {
    if (playingQueue.length > 0)
      setPlayingQueue([]);
    else
      setPlayingQueue(Array.from(Array(divText.length).keys()));
  }

  const saveAll = () => {
    onSaveProp?.call(null, divText, textUnitValues);
  }

  const dropdownSelected = (menuId: string, item: string, index: Number, textOffset: number) => {
    console.log(menuId);
    console.log(item);
    console.log(index);
    console.log(textOffset);
    const divTextIndex = Number.parseInt(menuId);
    if (item === '▶') { // play
      setPlayingQueue([divTextIndex]);
    }

    let newDivText = divText;
    if (item == 'x') {
      if (divTextIndex + 1 < divText.length) {
        setDivText((prev) => [
          ...prev.slice(0, divTextIndex),
          {
            ...prev[divTextIndex + 1],
            divider: prev[divTextIndex].divider + prev[divTextIndex + 1].divider
          },
          ...prev.slice(divTextIndex + 2)
        ]);
        if (divTextIndex === 0) {
          newDivText = newDivText.slice(1);
        }
      }
      else {
        setDivText((prev) => [...prev.slice(0, divTextIndex)]);
      }
    }
    if (item == '/') {
      const off = Math.max(1, textOffset);
      // const divDivText = divideDivText(divTextIndex, off);
      newDivText = divideDivText(divTextIndex, off);
      let colIdx = colorSeries.indexOf(divText[divTextIndex].senBgColor);
      colIdx = (colIdx + colorSeries.length * 0.5) % colorSeries.length;
      newDivText[divTextIndex + 1].senBgColor = colorSeries[colIdx];
      setDivText(newDivText);
    }

    if (item == 'x' || item == '/') {
      setTextUnitProps((prev) => ({...prev,
        text: newDivText[0].sentence,
        length: 0,
        textareaOption: {backgroundColor: newDivText[0].senBgColor}
      }));
    }
  }
  
  const handleTemplateChange = (value: string, processor: TemplateProcessor) => {
    console.log(`handleTemplateChange`);
    console.log(processor);
    //setTemplateProc(processor);
    templateProc = processor;
    refreshSegmentedText(langId, text);
  }

  return (
    <div className='add-text-bg'>
      <div className='user-text-side'>
            <div className='user-text-and-langid'>
                <TextareaAutoResize
                    className='user-text'
                    value={text}
                    onChange={(e) => handleTextChange(e.currentTarget.value)}
                    placeholder='Write/Paste text here...'
                />
                <DropdownSelector<LangIdType, BlankType> blankKey={Blank} keys={langIdOptions} selectedKey={langId} onChange={handleLangId}/>
            </div>
      </div>

      <div className='text-refine-side'>
        <TextTemplates langId={langId} onChange={handleTemplateChange}/>
        <div className='sentence-segments'>
          {divText.map((s, idx) => {
            return (<>
              <span onMouseDown={idx > 0 ? moveDividerBegin : moveDividerWrongStartingPoint} onMouseMove={moveDivider} key={idx * 2}
                style={{...{"--selection-color": s.divSelColor} as CSSProperties}}
                className={idx > 0 ? "sentence-divider" : ""}>
                  {((idx > 0 && s.divider.indexOf(' ') < 0) ? " " + s.divider : s.divider)
                    .replaceAll(' ', '\u00A0')
                  }
              </span>
              <DropdownMenu onMouseDown={moveDividerWrongStartingPoint} onMouseMove={moveDivider} key={idx * 2 + 1}
                addStyle={{...{"--selection-color": s.senSelColor} as CSSProperties,
                backgroundColor: s.senBgColor}}
                menuWidth={30}
                menuId={idx.toString()}
                items={menuForDivText}
                onSelected={dropdownSelected}>
                  {s.sentence}
              </DropdownMenu>
            </>);
          })}
        </div>

        <TextUnit
          textId={paragraphKeyProp}
          {...textUnitProps}
          visibleTrans={false}
          textareaOption={{
            ...textUnitProps.textareaOption,
            readOnly: true,
          }}
          onChange={(values) => setTextUnitValues(values)}
        />
        <div className='play-all'>
          <button key={0} onClick={playAll}>
            {playingQueue.length > 0 ? '■' : '▶'}
          </button>
        </div>
        <div className='save-all'>
          <button key={0} onClick={saveAll}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

