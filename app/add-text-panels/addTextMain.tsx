'use client'
import './layout.css';
import { ChangeEvent, useContext, useState } from 'react';
import { Blank, BlankType, LangIdType, LangIds, colorSeries } from '../baseTypes';
import DropdownSelector from '../dropdown-selector/dropdownSelector';
import { LanguageIdentifierContext } from '../language-identifier/languageIdentifier';
import TextUnit from '../text-unit/textUnit';
import TextareaAutoResize from '../textarea-auto-resize/textareaAutoResize';
import segment from 'sentencex';
import { LanguageIdentifierResultType } from '../linguaWrapper';

export default function AddTextMain() {
  const [text, setText] = useState('');
  const [langId, setLangId] = useState<LangIdType|BlankType>(Blank);
  const [langIdOptions, setLangIdOptions] = useState<LangIdType[]>([]);
  const [divText, setDivText] = useState<JSX.Element[]>([]);
  const languageIdentifier = useContext(LanguageIdentifierContext);

  const refreshSegmentedText = (langId: string, value: string) => {
    const sentences: string[] = segment(langId, value)
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
    
    const newDivText = [];
    for (let i = 0; i < sentences.length; i++) {
      let whiteSpace = (dividers[i].indexOf(' ') < 0 ? " " + dividers[i] : dividers[i])
        .replaceAll(' ', '\u00A0');
      newDivText.push(<span key={i * 2} className={i > 0 ? "sentence-divider" : ""}>{whiteSpace}</span>);
      const s = sentences[i];
      const color = colorSeries[i % colorSeries.length];
      newDivText.push(<span key={i * 2 + 1} style={{backgroundColor: color}}>{s}</span>);
    }
    setDivText(newDivText);
  }

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    if (text === value)
      return;

    setText(value);
    console.log('handleTextChange : ' + value);
    languageIdentifier.Query!(value, (langAndProbs: LanguageIdentifierResultType) => {
      const newLangIdCands: LangIdType[] =
        langAndProbs.filter((e) => LangIds.includes(e.language as LangIdType))
          .map((e) => e.language as LangIdType);
      setLangIdOptions(newLangIdCands);
      if (newLangIdCands.length > 0) {
        const newLangId = newLangIdCands[0];
        setLangId(newLangId);
        refreshSegmentedText(newLangId, value);
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
          {divText.length > 0 && divText}
        </div>

        <TextUnit
          key={0}
          textId={'imsii-0'}
          text={""}
          langId={'en'}
          translations={[]}
          speed={1.4}
          length={3.5}
          dialectId={'en-US'}
          onChange={undefined}
          visibleTrans={false}
          //textareaOption={{backgroundColor: 'skyblue', readOnly: true}}
        />
      </div>
    </div>
  );
}


