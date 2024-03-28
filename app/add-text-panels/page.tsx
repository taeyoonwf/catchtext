'use client'
import { Blank, BlankType, LangIdType } from '../baseTypes';
import DropdownSelector from '../dropdown-selector/dropdownSelector';
import { LanguageIdentifier } from '../language-identifier/languageIdentifier';
import { SpeechSynthesizer } from '../speech-synthesizer/speechSynthesizer';
import TextUnit from '../text-unit/textUnit';
import TextareaAutoResize from '../textarea-auto-resize/textareaAutoResize';
import './layout.css';

export default function AddText() {
  const op1 = 'nowrap';
  const op2 = 'inline-block';
  const op3 = 'wrap';
  const op4 = 'break-word';

  return (
    <SpeechSynthesizer><LanguageIdentifier>
    <div className='text-unit-bg2'>

      <div className='text-part2'>
            <div className='text-and-langid2'>
                <TextareaAutoResize
                    className='text-part-text2'
                    value={'asdf'}
                    onChange={undefined}
                    placeholder='Write/Paste text here...'
                />
                <DropdownSelector<LangIdType, BlankType> blankKey={Blank} keys={['en', 'fr', 'es']} selectedKey={'en'} />
            </div>
      </div>

      <div className='translation-part2'>
        <div className='templates'>
          Template: 
          <input type="radio" id="contactChoice1" name="contact" value="normal" />
          <label htmlFor="contactChoice1">Normal</label>

          <input type="radio" id="contactChoice2" name="contact" value="listeningExam1" />
          <label htmlFor="contactChoice2">Listening Exam 1</label>

          <input type="radio" id="contactChoice3" name="contact" value="listeningExam2" />
          <label htmlFor="contactChoice3">Listening Exam 2</label>
        </div>
        <div className='sentence-segments'>

            <span style={{backgroundColor: 'pink'}}>Hello!</span>
            <span style={{cursor: 'col-resize', border: '0px'}}> </span>
            <span style={{backgroundColor: 'skyblue'}}>{'What do you want?'}</span>
            <span style={{cursor: 'col-resize', border: '0px'}}> </span>
            <span style={{backgroundColor: 'coral'}}>Happy Happy Joy Joy</span>
            <span style={{cursor: 'col-resize', border: '0px'}}> </span>

            <span style={{backgroundColor: 'pink'}}>Hello!</span>
            <span style={{cursor: 'col-resize', border: '0px'}}> </span>
            <span style={{backgroundColor: 'skyblue'}}>{'What do you want?'}</span>
            <span style={{cursor: 'col-resize', border: '0px'}}> </span>
            <span style={{backgroundColor: 'coral'}}>Happy Happy Joy Joy</span>
            <span style={{cursor: 'col-resize', border: '0px'}}> </span>

            <span style={{backgroundColor: 'pink', border: '2px dotted black'}}>Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello! Hello!</span>
            <span style={{cursor: 'col-resize', border: '0px'}}> </span>
            <span style={{backgroundColor: 'skyblue'}}>
              {`Where should\nI go?`}
            </span>
            <span style={{cursor: 'col-resize', border: '0px'}}> </span>

        </div>
        <TextUnit
                  key={0}
                  textId={'imsii-0'}
                  text={'What do you want?'}
                  langId={'en'}
                  translations={[]}
                  speed={1.4}
                  break-word   length={3.5}
                  dialectId={undefined}
                  onChange={undefined}
                  visibleTrans={false}
                  textareaOption={{backgroundColor: 'skyblue', readOnly: true}}
         />
      </div>
  </div>
  </LanguageIdentifier></SpeechSynthesizer>

    );
}


