import React, { createContext, useEffect } from "react";

type StopCallbackFunc = (forcedStop: boolean, playingTimeInNormalSpeed: number) => void;

interface SpeechSynthesizerContextType {
  PlayText?: (text: string, langDialectId: string, speed: number, stopCallback: StopCallbackFunc) => void;
  IsPlaying?: () => boolean;
  Stop?: () => void;
}

const SpeechSynthesizerContext = createContext<SpeechSynthesizerContextType>({});
const voices: {[key in string]?: SpeechSynthesisVoice} = {};
let stopCallbackReg: StopCallbackFunc|null = null;
let isPlaying = false;
let playStartTime: Date = new Date();
let autoResumeTimeout: NodeJS.Timeout; // https://stackoverflow.com/questions/21947730
let playingUtterance: SpeechSynthesisUtterance|undefined = undefined;

function SpeechSynthesizer({
  children,
}: {
  children: React.ReactNode
}) {
  const speedConst: number = 1.45;

  useEffect(() => {
    console.log(`speech synthesizer useEffect`);
    const handleVoicesChanged = () => {
      if (Object.keys(voices).length === 0) {
        const dialects: {[key in string]: number} = {};
        for (const voice of window.speechSynthesis.getVoices()) {
          const lang = voice.lang.substring(0, 2);
          if (dialects[lang] === undefined)
            dialects[lang] = 0;
          dialects[lang] += 1;
        }
        console.log(dialects);

        for (const voice of window.speechSynthesis.getVoices()) {
          let lang: string = voice.lang;
          if (voice.name.endsWith(' Female'))
            lang += "-0";
          else if (voice.name.endsWith(' Male'))
            lang += "-1";
          if (dialects[lang.substring(0, 2)] > 1) {
            voices[lang] = voice;
          }
          else {
            voices[lang.substring(0, 2)] = voice;
          }
        }
        console.log(voices);
      }
    }

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    return () => {
        window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const PlayText = (
    text: string,
    langDialectId: string,
    speed: number,
    stopCallback: (forcedStop: boolean, playingTimeInNormalSpeed: number) => void
  ) => {
    console.log(voices);
    if (voices[langDialectId] === undefined) {
      console.log(`${langDialectId} is not in browser built-in voices.`);
      stopCallback.call(null, true, 0);
      return;
    }
    if (text.length === 0) {
      stopCallback.call(null, true, 0);
      return;
    }

    if (playingUtterance !== undefined) {
      playingUtterance = undefined;
      stopCallbackReg!.call(null, true, 0);
      // setPlayingUtterence(undefined);
      window.speechSynthesis.cancel();
      isPlaying = false;
      //return;
    }

    console.log('here1');
    const voice: SpeechSynthesisVoice = voices[langDialectId]!;
    //const voiceId = (dialectId !== blank) ? dialectId : langId;
    //console.log(`voiceId : ${voiceId}`);
    //if (!Object.keys(voices).includes(voiceId)) {
    //  return;
    //}

    console.log('here2');
    //const voice: SpeechSynthesisVoice = (voiceId.length == 2) ? voices[voiceId as LangIdType]! : voices[voiceId as DialectIdType]!;
    stopCallbackReg = stopCallback;

    function autoResumeTimer() {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
      autoResumeTimeout = setTimeout(autoResumeTimer, 1000);
    }

    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = voice;
    utterThis.rate = (speed < 1.0) ? speed : Math.pow(speed, 1.0 / speedConst);
    utterThis.onstart = (ev: SpeechSynthesisEvent) => {
      const curTarget: SpeechSynthesisUtterance = ev.currentTarget as SpeechSynthesisUtterance;
      playingUtterance = curTarget;
      isPlaying = true;
      playStartTime = new Date();
      console.log(`start ` + playStartTime);
    }
    utterThis.onend = (ev: SpeechSynthesisEvent) => {
      const curTarget: SpeechSynthesisUtterance = ev.currentTarget as SpeechSynthesisUtterance;
      //console.log('end1 : ');
      //console.log(playingUtterance);
      //console.log('end2 : ');
      //console.log(curTarget);
      clearTimeout(autoResumeTimeout);
      if (playingUtterance === curTarget) {
          //console.log('finished!');
          playingUtterance = undefined;
          const playEndTime = new Date();
          const duration: number = (playEndTime.getTime() - playStartTime.getTime()) / 1000.0;
          console.log(`Speech duration: ${duration} ms`);
          //setLength(duration * ((speed < 1.0) ? speed : Math.pow(curTarget.rate, speedConst)));
          const length = duration * ((speed < 1.0) ? speed : Math.pow(curTarget.rate, speedConst));
          stopCallbackReg!.call(null, false, length);
          console.log(`end ` + playEndTime);
      }
      isPlaying = false;
    }
    utterThis.onpause = (ev: SpeechSynthesisEvent) => {
      console.log('onpause');
      console.log(ev);
    }
    utterThis.onerror = (ev: SpeechSynthesisErrorEvent) => {
      console.log('onerror');
      console.log(ev);
    }
    //console.log(utterThis);
    window.speechSynthesis.cancel();
    autoResumeTimeout = setTimeout(autoResumeTimer, 10000);
    window.speechSynthesis.speak(utterThis);
  }

  const IsPlaying = () => isPlaying;

  const Stop = () => {
    if (playingUtterance !== undefined) {
      playingUtterance = undefined;
      stopCallbackReg!.call(null, true, 0);
      window.speechSynthesis.cancel();
      isPlaying = false;
    }
  }

  return (
    <SpeechSynthesizerContext.Provider value={{ PlayText, IsPlaying, Stop }}>
      {children}
    </SpeechSynthesizerContext.Provider>
  );
}

export { SpeechSynthesizer, SpeechSynthesizerContext };