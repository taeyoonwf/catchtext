"use client"
import './layout.css';
import React, { useState, useEffect, useRef } from "react";

export default function Home() {
    const [text, setText] = useState("");
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]); // = [];
    const [voice, setVoice] = useState(-1);
    const playingUtterance = useRef<SpeechSynthesisUtterance|undefined>(undefined);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const [duration, setDuration] = useState(0.0);
    const speeds: number[] = [0.6, 0.8, 1.0, 1.2, 1.4];
    let playStartTime: Date = new Date();
    let playEndTime: Date = new Date();
    const speedConst: number = 1.45;

    useEffect(() => {
        const handleVoicesChanged = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            console.log(availableVoices);
            setVoices(availableVoices.sort((a, b) => {
                const strA = a.lang + a.name;
                const strB = b.lang + b.name;
                if (strA.toUpperCase() < strB.toUpperCase())
                    return -1;
                if (strA.toUpperCase() > strB.toUpperCase())
                    return 1;
                return 0;
            }));
        };

        // Set up the event listener
        window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

        // Trigger voice loading
        handleVoicesChanged();

        // Cleanup
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);
    const handleTextChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        setText(value);
        setDuration(0);
    };
    
    const handleSubmit = () => {}

    const playTts = (e: React.MouseEvent<HTMLButtonElement>) => {
        //console.log(playingUtterance);
        if (playingUtterance.current !== undefined) {
            playingUtterance.current = undefined;
            // setPlayingUtterence(undefined);
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }
        const anchor = e.target as HTMLAnchorElement;
        const key = anchor.getAttribute('key');

        if (voice === -1) {
            console.log('Select a voice.');
            return;
        }
        console.log(text + 'speed ' + speed);
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.voice = voices[voice];
        utterThis.rate = (speed < 1.0) ? speed : Math.pow(speed, 1.0 / speedConst);
        utterThis.onstart = (ev: SpeechSynthesisEvent) => {
            const curTarget: SpeechSynthesisUtterance = ev.currentTarget as SpeechSynthesisUtterance;
            playingUtterance.current = curTarget;
            setIsPlaying(true);
            playStartTime = new Date();
            console.log(`start ` + playStartTime);
        }
        utterThis.onend = (ev: SpeechSynthesisEvent) => {
            const curTarget: SpeechSynthesisUtterance = ev.currentTarget as SpeechSynthesisUtterance;
            //console.log('end1 : ');
            //console.log(playingUtterance);
            //console.log('end2 : ');
            //console.log(curTarget);
            if (playingUtterance.current === curTarget) {
                //console.log('finished!');
                playingUtterance.current = undefined;
                playEndTime = new Date();
                const duration: number = playEndTime.getTime() - playStartTime.getTime();
                console.log(`Speech duration: ${duration} ms`);
                setDuration(duration * ((speed < 1.0) ? speed : Math.pow(curTarget.rate, speedConst)));
                console.log(`end ` + playEndTime);
            }
            setIsPlaying(false);
        }
        utterThis.onerror = (ev: SpeechSynthesisErrorEvent) => {
            console.log(ev);
        }
        window.speechSynthesis.speak(utterThis);
    }

    const handleVoice = (e: React.FormEvent<HTMLSelectElement>) => {
        const selectedIndex = e.currentTarget.selectedIndex;
        //console.log(e.currentTarget.selectedIndex);
        //setVoice()
        setVoice(selectedIndex);
    };

    const handleSpeed = (e: React.FormEvent<HTMLSelectElement>) => {
        const selectedIndex = e.currentTarget.selectedIndex;
        setSpeed(speeds[selectedIndex]);
    }

    return (<>
        <form onSubmit={handleSubmit}>
            <input
                className="input-text"
                type="text"
                value={text}
                size={50}
                onChange={handleTextChange}
            />
        </form>
        {duration > 0 && <div className='durationInfo'>{Math.round(duration / 10) / 100}s</div>}
        <button onClick={playTts} className='playBtn'>
            {`${!isPlaying && text.length > 0 ? '▶' : '■'}`}
        </button>
        <select className='selectSpeed' onChange={handleSpeed} value={speed}>
            {
                speeds.map((val, index) => {
                    return <option value={val} key={index}>{val}</option>
                })
            }
        </select>
        <select className='selectVoice' onChange={handleVoice} value={`${voice > -1 ? voices[voice].name : ''}`}>
            {
                voices.map((val, index) => {
                    return <option value={val.name} key={index}>{val.lang} - {val.name}</option>
                })
            }
        </select>
    </>);
}