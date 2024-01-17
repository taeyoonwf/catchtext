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
import { useState } from 'react';

export default function Home() {
    const [tab, setTab] = useState(0);
    const [headerToggle, setHeaderToggle] = useState(true);
    const menuText = ["Home", "Add Text", "Library", "Quiz", "Dictionary", "etc"];
    const pages = [HomePage, AddText, Library, Quiz, Dictionary, Etc];

    const clickMenuBtn = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // console.log(e.target); //e.target);
        // console.log(typeof e.target);
        const anchor = e.target as HTMLAnchorElement;
        // console.log(anchor.innerHTML.toString());
        const text = anchor.innerText;
        //console.log(anchor);
        //console.log(anchor.innerText);
        setTab(menuText.indexOf(text));
        //setTab(menuText.findIndex(text));
        // const menuText = ["Home", "Add Text", "Library", "Quiz", "Dictionary", "etc"];
        if (text === menuText[0] || text === menuText[1] || text === menuText[3] || text === menuText[5]) {
            setHeaderToggle(false);
        }
        else {
            setHeaderToggle(true);
        }
    }
    return (<>
        <div className="left-part">
            <div className='menu'>
                {menuText.map((e) => (<a
                    href={`#${e.replace(/\s/g, '')}`}
                    className={`menu-btn ${e === "Home" ? 'home-btn' : ''}`}
                    onClick={clickMenuBtn}
                    key={`${e}`}><span>
                    {e}
                </span></a>))}
            </div>
        </div>
        <div className="right-part">
            {headerToggle && <Header />}
            <LoginPanel />
            <div className={`main-content ${headerToggle ? 'header-padding' : ''}`}>
                {pages[tab]()}
            </div>
        </div>
    </>);
}