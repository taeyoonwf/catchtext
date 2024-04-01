'use client'
import './layout.css';
import { CSSProperties, ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { Blank, BlankType, DefaultDialect, LangIdType, LangIds, colorSeries } from '../baseTypes';
import DropdownSelector from '../dropdown-selector/dropdownSelector';
import { LanguageIdentifierContext } from '../language-identifier/languageIdentifier';
import TextUnit, { TextUnitProps } from '../text-unit/textUnit';
import TextareaAutoResize from '../textarea-auto-resize/textareaAutoResize';
import segment from 'sentencex';
import { LanguageIdentifierResultType } from '../linguaWrapper';

interface divTextArgs {
  divider: string;
  sentence: string;
  senBgColor: string;
  divSelColor: string;
  senSelColor: string;
} 

enum MoveDivider {
  NoAction,
  MoveStarted,
  CheckedStartIndex,
  WrongStartingPoint,
}
let moveDividerStage: MoveDivider = MoveDivider.NoAction;
const TRANSP = 'transparent';

export default function AddTextMain() {
  const [text, setText] = useState('');
  const [langId, setLangId] = useState<LangIdType|BlankType>(Blank);
  const [langIdOptions, setLangIdOptions] = useState<LangIdType[]>([]);
  const [divText, setDivText] = useState<divTextArgs[]>([]);
  const languageIdentifier = useContext(LanguageIdentifierContext);
  const [textUnitProps, setTextUnitProps] = useState<TextUnitProps>({text: ' '});
 
  const onAllMouseUp = (e: any) => moveDividerDone(e);

  useEffect(() => {
    document.addEventListener('mouseup', onAllMouseUp);
    return () => {
      document.removeEventListener('mouseup', onAllMouseUp);
    };
  });

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
        console.log(sel.anchorNode);
        console.log(sel.focusNode);
        const anchorNodeIndex = Array.prototype.indexOf.call(sel.anchorNode?.parentNode?.parentNode?.childNodes, sel.anchorNode?.parentNode);
        console.log("anchorNodeIndex : " + anchorNodeIndex);
  
        moveDividerStage = MoveDivider.CheckedStartIndex;
        //checkAnchor = false;
        //setSelDivTextIndex(Math.floor((anchorNodeIndex + 1) * 0.5));
        
        const divIndex = Math.floor((anchorNodeIndex + 1) * 0.5);
        const colorPrev = divText[divIndex - 1].senBgColor;
        const colorNext = divText[divIndex].senBgColor;
        const newDivText: divTextArgs[] = [];
        for (let i = 0; i < divText.length; i++) {
          newDivText[i] = {
            divider: divText[i].divider,
            sentence: divText[i].sentence,
            senBgColor: divText[i].senBgColor,
            divSelColor: (i < divIndex) ? colorNext : ((i == divIndex) ? TRANSP : colorPrev),
            senSelColor: (i < divIndex) ? colorNext : colorPrev,
          };
        }
        setDivText(newDivText);
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

  const mergePartOfDivTextArr = (fromIndex: number, toIndex: number, mergeColorFromIndex: boolean, arr: divTextArgs[]) => {
    if (fromIndex === toIndex)
      return;
    console.log(`fromIndex: ${fromIndex}, toIndex: ${toIndex}`);
    const mergedSentenceList = [arr[fromIndex].sentence,
      ...arr.slice(fromIndex + 1, toIndex).reduce((acc: string[], curr, _) => (acc.push(curr.divider + curr.sentence), acc), [])];
    const mergedSentence = mergedSentenceList.join('');
    setDivText([
      ...arr.slice(0, fromIndex).map((e, _) => (
        {...e, divSelColor: TRANSP, senSelColor: TRANSP}
      )),
      {
        divider: arr[fromIndex].divider,
        sentence: mergedSentence,
        senBgColor: mergeColorFromIndex ? arr[fromIndex].senSelColor : arr[toIndex - 1].senSelColor,
        divSelColor: TRANSP,
        senSelColor: TRANSP
      },
      ...arr.slice(toIndex, arr.length).map((e, _) => (
        {...e, divSelColor: TRANSP, senSelColor: TRANSP}
      ))
    ]);
  }

  const moveDividerDone = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    console.log("moving done");
    const sel = window.getSelection();
    console.log(sel);
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
          const startIndex = Math.floor((anchorNodeIndex + 1) * 0.5);
          const endIndex = focusNodeIndex / 2;
          // console.log(`endIndex: ${endIndex}, startIndex: ${startIndex}`);
          let fromIndex = (endIndex < startIndex) ? endIndex : startIndex - 1;
          let toIndex = (endIndex < startIndex) ? startIndex + 1 : endIndex;
          mergePartOfDivTextArr(fromIndex, toIndex, endIndex < startIndex, divText);
        }
      }
      else {
        if (focusNodeIndex < anchorNodeIndex || focusNodeIndex == anchorNodeIndex && sel.focusOffset <= sel.anchorOffset) {
          const startIndex = Math.floor((anchorNodeIndex + 1) * 0.5);
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
        }
        else {
          const startIndex = Math.floor(anchorNodeIndex * 0.5);
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
    const sentences: string[] = segment(langId !== Blank ? langId : 'en', value)
      .map((s, index) => s.trim())
      .filter((s, index) => s.length > 0);
    let value_index = 0;
    //let sent_index = 0;
    const dividers: string[] = [];

    //while (true) {
    for (let sent_index = 0; sent_index < sentences.length; sent_index++) {
      const curr = value.indexOf(sentences[sent_index], value_index);
      dividers.push(value.substring(value_index, curr));
      value_index = curr + sentences[sent_index].length;
    }
    //dividers.push(value.substring(value_index, value.length));

    console.log(dividers);
    console.log(sentences);
    
    setDivText(sentences.map((s, index) => ({
      divider: dividers[index],
      sentence: s,
      senBgColor: colorSeries[index % colorSeries.length],
      divSelColor: TRANSP,
      senSelColor: TRANSP
    } as divTextArgs)));

    setTextUnitProps((prev) => ({...prev,
      visibleTrans: false,
      text: sentences.length > 0 ? sentences[0] : ' ',
      langId: langId as any,
      dialectId: DefaultDialect[langId as LangIdType],
      length: 0,
      textareaOption: {backgroundColor: sentences.length > 0 ? sentences[0] : TRANSP}
    }));
  }

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    if (text === value)
      return;

    setText(value);
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
  }

  return (
    <div className='add-text-bg'>
      <div className='user-text-side'>
            <div className='user-text-and-langid'>
                <TextareaAutoResize
                    className='user-text'
                    value={text}
                    onChange={handleTextChange}
                    placeholder='Write/Paste text here...'
                />
                <DropdownSelector<LangIdType, BlankType> blankKey={Blank} keys={langIdOptions} selectedKey={langId} onChange={handleLangId}/>
            </div>
      </div>

      <div className='text-refine-side'>
        <div className='text-templates'>
          Template: 
          <span>
            <input type="radio" id="contactChoice1" name="contact" value="normal" onChange={() => {}} checked />
            <label htmlFor="contactChoice1">Normal</label>
          </span>

          <span>
            <input type="radio" id="contactChoice2" name="contact" value="listeningExam1" />
            <label htmlFor="contactChoice2">Listening Exam 1</label>
          </span>

          <span>
          <input type="radio" id="contactChoice3" name="contact" value="listeningExam2" />
          <label htmlFor="contactChoice3">Listening Exam 2</label>
          </span>


          <span>
          <input type="radio" id="contactChoice4" name="contact" value="listeningExam3" />
          <label htmlFor="contactChoice4">Listening Exam 3</label>
          </span>

          <span>
          <input type="radio" id="contactChoice5" name="contact" value="listeningExam4" />
          <label htmlFor="contactChoice5">Listening Exam 4</label>
          </span>


          <span>
          <input type="radio" id="contactChoice6" name="contact" value="listeningExam5" />
          <label htmlFor="contactChoice6">Listening Exam 5</label>
          </span>

          <span>
          <input type="radio" id="contactChoice7" name="contact" value="listeningExam6" />
          <label htmlFor="contactChoice7">Listening Exam 6</label>
          </span>
        </div>

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
              <span onMouseDown={moveDividerWrongStartingPoint} onMouseMove={moveDivider} key={idx * 2 + 1}
                style={{...{"--selection-color": s.senSelColor} as CSSProperties,
                backgroundColor: s.senBgColor}}>
                  {s.sentence}
              </span>
            </>);
          })}
        </div>

        <TextUnit
          {...textUnitProps}
          visibleTrans={false}
          textareaOption={{
            ...textUnitProps.textareaOption,
            readOnly: true,
          }}
        />
      </div>
    </div>
  );
}

