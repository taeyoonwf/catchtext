"use client"
import './layout.css';
import AddText from './addText';
import Library from './library';
import Header from './header';
import LoginPanel from './loginPanel';
import Dictionary from './dictionary';
import Etc from './etc';
import Quiz from './quiz';
import HomePage from './homePage';
import { useState } from 'react';

export default function Home() {
    const [tab, setTab] = useState(0);
    const [headerToggle, setHeaderToggle] = useState(true);
    const menuText = ["Home", "Add Text", "Library", "Quiz", "Dictionary", "etc"];
    const pages = [HomePage, AddText, Library, Quiz, Dictionary, Etc];

    const mainContent = () => pages[tab]();

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
        if (text === "Home" || text === "Add Text" || text === "Quiz" || text === "etc") {
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
                    href={`#`}
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