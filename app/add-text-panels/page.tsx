'use client'
import { ChangeEvent, useState } from 'react';
import { Blank, BlankType, LangIdType } from '../baseTypes';
import DropdownSelector from '../dropdown-selector/dropdownSelector';
import { LanguageIdentifier } from '../language-identifier/languageIdentifier';
import { SpeechSynthesizer } from '../speech-synthesizer/speechSynthesizer';
import TextUnit from '../text-unit/textUnit';
import TextareaAutoResize from '../textarea-auto-resize/textareaAutoResize';
import './layout.css';
import segment from 'sentencex';

export default function AddText() {
  const [text, setText] = useState('');

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    const { value } = e.currentTarget;
    setText(value);
    //console.log(segment);
    console.log(segment("en", value));
  }

  return (<SpeechSynthesizer><LanguageIdentifier>
    <div className='add-text-bg'>
      <div className='user-text-side'>
            <div className='user-text-and-langid'>
                <TextareaAutoResize
                    className='user-text'
                    value={text}
                    onChange={handleTextChange}
                    placeholder='Write/Paste text here...'
                />
                <DropdownSelector<LangIdType, BlankType> blankKey={Blank} keys={['en', 'fr', 'es']} selectedKey={'en'} />
            </div>
      </div>

      <div className='text-refine-side'>
        <div className='text-templates'>
          Template: 
          <span>
            <input type="radio" id="contactChoice1" name="contact" value="normal" />
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
          <span style={{backgroundColor: 'pink'}}>Hello!</span>
          <span className="sentence-divider"> </span>
          <span style={{backgroundColor: 'skyblue'}}>{'What do you want?'}</span>
          <span className="sentence-divider"> </span>
          <span style={{backgroundColor: 'coral'}}>Happy Happy Joy Joy</span>
          <span className="sentence-divider"> </span>

          <span style={{backgroundColor: 'pink'}}>Hello!</span>
          <span className="sentence-divider"> </span>
          <span style={{backgroundColor: 'skyblue'}}>{'What do you want?'}</span>
          <span className="sentence-divider"> </span>
          <span style={{backgroundColor: 'coral'}}>Happy Happy Joy Joy</span>
          <span className="sentence-divider"> </span>

          <span style={{backgroundColor: 'pink', border: '1px dotted black'}}>Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello!</span>
          <span className="sentence-divider"> </span>
          <span style={{backgroundColor: 'skyblue'}}>
            {`Where should\nI go?`}
          </span>
          <span className="sentence-divider"> </span>
        </div>

        <TextUnit
          key={0}
          textId={'imsii-0'}
          text={"We're gonna talk about the issue or lack thereof."}
          langId={'en'}
          translations={[]}
          speed={1.4}
          length={3.5}
          dialectId={'en-US'}
          onChange={undefined}
          visibleTrans={false}
          textareaOption={{backgroundColor: 'skyblue', readOnly: true}}
        />
      </div>
    </div>
  </LanguageIdentifier></SpeechSynthesizer>);
}


