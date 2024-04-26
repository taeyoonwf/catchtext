"use client"
import './layout/layout.css';
import AddText from './layout/addText';
import Library from './layout/library';
import Header from './layout/header';
import LoginPanel, { LoginPanelProps } from './layout/loginPanel';
import Dictionary from './layout/dictionary';
import Etc from './layout/etc';
import Quiz from './layout/quiz';
import HomePage from './layout/homePage';
import { useState, useEffect } from 'react';
import { DataStorage } from './data-storage/dataStorage';
import { SpeechSynthesizer } from './speech-synthesizer/speechSynthesizer';
import { LanguageIdentifier } from './language-identifier/languageIdentifier';

export default function Home() {
    const menuText = ["Home", "Add Text", "Library", "Quiz", "Dictionary", "etc"];
    const [currentHash, setCurrentHash] = useState('#' + menuText[0]);
    const [headerToggle, setHeaderToggle] = useState(false);
    const pages = [
        <HomePage key='home' />,
        //<AddText key='addText' onSaveDone={() => console.log(`Save Done!!!!`)}/>,
        <AddText key='addText' />,
        <Library key='library' />,
        <Quiz key='quiz' />,
        <Dictionary key='dictionary' />,
        <Etc key='etc' />
    ];
    const loginPos: LoginPanelProps[] = [
        {},
        {position: 'absolute', top: 11, right: 11},
        {},
        {},
        {},
        {},
    ];

    useEffect(() => {
        const handleHashChange = () => {
            const pageIndex = getPageIndex(window.location.hash);
            if (pageIndex >= 0) {
                setCurrentHash(window.location.hash);
                setHeaderToggle(pageIndex == 2 || pageIndex == 4);
            }
            else {
                setCurrentHash('#' + menuText[0]);
            }
        };

        if (currentHash !== window.location.hash) {
            handleHashChange();
        }
        window.addEventListener('hashchange', handleHashChange);

        // Cleanup listener
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const getPageIndex = (hash: string) => menuText.findIndex((e: string) => e.replace(/\s/g, '') === hash.substring(1));

    return (<SpeechSynthesizer><LanguageIdentifier>
        <div className="left-part">
            <div className='menu'>
                {menuText.map((e) => (<a
                    href={`#${e.replace(/\s/g, '')}`}
                    className={`menu-btn ${e === "Home" ? 'home-btn' : ''}`}
                    key={`${e}`}><span>
                    {e}
                </span></a>))}
            </div>
        </div>
        <div className="right-part">
            {headerToggle && <Header />}
            <LoginPanel position={loginPos[getPageIndex(currentHash)].position}
                top={loginPos[getPageIndex(currentHash)].top}
                right={loginPos[getPageIndex(currentHash)].right}
            />
            <div className={`main-content ${headerToggle ? 'header-padding' : ''}`}>
                <DataStorage>
                    {getPageIndex(currentHash) >= 0 && pages[getPageIndex(currentHash)]}
                </DataStorage>
            </div>
        </div>
    </LanguageIdentifier></SpeechSynthesizer>);
}
