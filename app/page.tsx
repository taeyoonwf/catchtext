"use client"
import './layout/layout.css';
import AddText from './layout/addText';
import Library from './layout/library';
import Header from './layout/header';
import LoginPanel from './layout/loginPanel';
import Dictionary from './layout/dictionary';
import Etc from './layout/etc';
import Quiz from './layout/quiz';
import HomePage from './layout/homePage';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'

export default function Home() {
    const searchParams = useSearchParams();
    const menuText = ["Home", "Add Text", "Library", "Quiz", "Dictionary", "etc"];
    //const [currentHash, setCurrentHash] = useState('#' + menuText[0]);
    const [tab, setTab] = useState(0);
    const [headerToggle, setHeaderToggle] = useState(false);
    const pages = [
        <HomePage key='home' />,
        <AddText key='addText' />,
        <Library key='library' />,
        <Quiz key='quiz' />,
        <Dictionary key='dictionary' />,
        <Etc key='etc' />
    ];
    const [paramA, setParamA] = useState(searchParams.get('a'));

    const handleMenuBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
        // console.log(e.target); //e.target);
        // console.log(typeof e.target);
        const anchor = e.target as HTMLAnchorElement;
        const key = anchor.getAttribute('key');
        console.log(key);
        // console.log(anchor.innerHTML.toString());
        const text = anchor.innerText;
        //console.log(anchor);
        //console.log(anchor.innerText);
        const newTab = menuText.indexOf(text);
        setTab(newTab);
        //setTab(menuText.findIndex(text));
        // const menuText = ["Home", "Add Text", "Library", "Quiz", "Dictionary", "etc"];
        setHeaderToggle(newTab == 2 || newTab == 4);
    }

    const pushState = () => {
				const newParamA = paramA === null ? 't' : (paramA + 't');
        setParamA(newParamA);
        window.history.pushState({}, '', '?a=' + newParamA + window.location.hash);
    }

    return (<>
        <div className="left-part">
            <div className='menu'>
                {menuText.map((e, index) => (
                    <button onClick={handleMenuBtn}
                        className={`menu-btn ${e === "Home" ? 'home-btn' : ''}`}
                        key={index}>
                        {e}
                    </button>
                ))}
            </div>
        </div>
        <div className="right-part">
            {headerToggle && <Header />}
            <LoginPanel />
            <div className={`main-content ${headerToggle ? 'header-padding' : ''}`}>
                <a href='#hashtag'>Hash Tag</a>
                <button onClick={pushState}>Test</button>
                {paramA !== undefined && paramA}
                {pages[tab]}
            </div>
        </div>
    </>);
}
