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
  divSelColor: string;
  senSelColor: string;
} 

enum MoveDivider {
  NoAction,
  MoveStarted,
  CheckedStartIndex,
}
let moveDividerStage: MoveDivider = MoveDivider.NoAction;

export default function AddTextMain() {
  const [text, setText] = useState('');
  const [langId, setLangId] = useState<LangIdType|BlankType>(Blank);
  const [langIdOptions, setLangIdOptions] = useState<LangIdType[]>([]);
  const [divText, setDivText] = useState<divTextArgs[]>([]);
  const languageIdentifier = useContext(LanguageIdentifierContext);
  const [textUnitProps, setTextUnitProps] = useState<TextUnitProps>({text: ' '});
  //const [dividers, setDividers] = useState<string[]>([]);
  //const [sentences, setSentences] = useState<string[]>([]);
  //const [selColors, setSelColors] = useState<string[]>([]);
  //const [selDivTextIndex, setSelDivTextIndex] = useState(-1);

  const selection = useRef('');
  //let isMovingDivider = false;
  const [selColor, setSelColor] = useState('#555555');
        
  const handleSelection = () => {
    const sel = document.getSelection();
    if (sel !== null) {
      const text = sel.toString();
      //console.log('in handleSelection');
      //console.log(text);
      if (text) {
        selection.current = text;
      }  
    }
  }
 
  const onAllMouseUp = (e: any) => {
    if (moveDividerStage == MoveDivider.CheckedStartIndex) {
      moveDividerDone(e)
    }
  }

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    document.addEventListener('mouseup', onAllMouseUp);
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('mouseup', onAllMouseUp);
    };
   });

   //let checkAnchor = false;
   const moveDividerBegin = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    console.log('moving start');
    moveDividerStage = MoveDivider.MoveStarted
    //moveDividerStage = 1;
    //isMovingDivider = true;
    //checkAnchor = true;
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
        const colorPrev = colorSeries[(divIndex - 1) % colorSeries.length];
        const colorNext = colorSeries[divIndex % colorSeries.length];
        const newDivText: divTextArgs[] = [];
        for (let i = 0; i < divText.length; i++) {
          newDivText[i] = {
            divider: divText[i].divider,
            sentence: divText[i].sentence,
            divSelColor: (i < divIndex) ? colorNext : ((i == divIndex) ? 'transparent' : colorPrev),
            senSelColor: (i < divIndex) ? colorNext : colorPrev,
          };
          //divText[i].divSelColor = colorNext;
          //divText[i].senSelColor = colorNext;
        }
        setDivText(newDivText);
        //divText[divIndex].senSelColor = colorPrev;
        //for (let i = divIndex + 1; i < divText.length; i++) {
          //divText[i].divSelColor = colorPrev;
          //divText[i].senSelColor = colorPrev;
        //}
        console.log('anchor check finish ' + moveDividerStage);
      }
    }
    /*else {
      console.log('moveDividerStage ' + moveDividerStage);
    }*/
    //console.log(e.buttons);
  }

  const moveDividerDone = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    console.log("moving done");
    //console.log(e.currentTarget);
    //console.log(window.getSelection());
    //console.log(window.getSelection());
    const sel = window.getSelection();
    console.log(sel);
    console.log(moveDividerStage);
    if (sel !== null && moveDividerStage == MoveDivider.CheckedStartIndex) {
      console.log(sel.anchorNode);
      console.log(sel.focusNode);
      const anchorNodeIndex = Array.prototype.indexOf.call(sel.anchorNode?.parentNode?.parentNode?.childNodes, sel.anchorNode?.parentNode);
      const focusNodeIndex = Array.prototype.indexOf.call(sel.focusNode?.parentNode?.parentNode?.childNodes, sel.focusNode?.parentNode);
      const divIndex = Math.floor((anchorNodeIndex + 1) * 0.5);

      if (focusNodeIndex % 2 == 0) {
      }
      else {

      }
      console.log(anchorNodeIndex + ", " + focusNodeIndex);
      const colorIndex = Math.floor((anchorNodeIndex - 1) * 0.5);
      setSelColor(colorSeries[colorIndex % colorSeries.length]);
      console.log(colorSeries[colorIndex % colorSeries.length]);

      moveDividerStage = MoveDivider.NoAction
      const newDivText: divTextArgs[] = [];
      for (let i = 0; i < divText.length; i++) {
        newDivText[i] = {
          divider: divText[i].divider,
          sentence: divText[i].sentence,
          divSelColor: 'transparent',
          senSelColor: 'transparent',
        };
      }
      setDivText(newDivText);

      /*
      console.log(sel.anchorNode?.nodeValue);
      console.log(sel.anchorNode?.nodeType);
      console.log(sel.anchorNode?.nodeName);
      console.log(sel.anchorNode?.ownerDocument);
      console.log(sel.anchorNode?.getRootNode());
      console.log(sel.anchorNode?.parentElement);
      console.log(sel.anchorNode?.parentNode);
      console.log(sel.anchorNode?.parentElement?.parentElement);
      console.log(sel.anchorNode?.parentNode?.parentNode);
      console.log(sel.anchorNode?.parentElement?.children);
      */
    }
    window.getSelection()?.empty();
    //isMovingDivider = false;
    //console.log(window.getSelection().);
    //e.currentTarget.DOCUMENT_POSITION_PRECEDING
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
    /*for (let i = 0; i < dividers.length; i++) {
      console.log(dividers[i]);
      if (i + 1 < dividers.length)
        console.log(sentences[i]);
    }*/
    
    //<span style={{backgroundColor: 'pink'}}>Hello!</span>
    //<span className="sentence-divider"> </span>
    
    const newDivText: divTextArgs[] = [];
    for (let i = 0; i < sentences.length; i++) {
      //let whiteSpace = (dividers[i].indexOf(' ') < 0 ? " " + dividers[i] : dividers[i])
      //  .replaceAll(' ', '\u00A0');
      //newDivText.push(<span onMouseDown={moveDividerBegin} onMouseUp={moveDividerDone} onMouseMove={moveDivider}
      //  key={i * 2} className={i > 0 ? "sentence-divider" : ""}>
      //    {whiteSpace}
      //</span>);
      //const s = sentences[i];
      //const color = colorSeries[i % colorSeries.length];
      //newDivText.push(<span onMouseUp={moveDividerDone} onMouseMove={moveDivider}
      //  key={i * 2 + 1} style={{...{"--selection-color": selColor} as React.CSSProperties, backgroundColor: color}}>{s}</span>);
      newDivText.push({
        divider: dividers[i],
        sentence: sentences[i],
        divSelColor: 'transparent',
        senSelColor: 'transparent',
      });
    }
    setDivText(newDivText);

    setTextUnitProps((prev) => ({...prev,
      visibleTrans: false,
      text: sentences.length > 0 ? sentences[0] : ' ',
      langId: langId as any,
      dialectId: DefaultDialect[langId as LangIdType],
      length: 0,
      textareaOption: {backgroundColor: sentences.length > 0 ? colorSeries[0] : 'transparent'}
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
      //const color = colorSeries[i % colorSeries.length];
      //newDivText.push(<span onMouseUp={moveDividerDone} onMouseMove={moveDivider}
      //  key={i * 2 + 1} style={{...{"--selection-color": selColor} as React.CSSProperties, backgroundColor: color}}>{s}</span>);

            return (<>
              <span onMouseDown={moveDividerBegin} onMouseMove={moveDivider} key={idx * 2}
                style={{...{"--selection-color": s.divSelColor} as CSSProperties}}
                className={idx > 0 ? "sentence-divider" : ""}>
                  {(s.divider.indexOf(' ') < 0 ? " " + s.divider : s.divider)
                    .replaceAll(' ', '\u00A0')
                  }
              </span>
              <span onMouseMove={moveDivider} key={idx * 2 + 1}
                style={{...{"--selection-color": s.senSelColor} as CSSProperties,
                backgroundColor: colorSeries[idx % colorSeries.length]}}>
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

