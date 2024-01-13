"use client"
import './layout.css';
import AddText from './addtext';
import Library from './library';
import Header from './header';
import { useState } from 'react';

export default function Home() {
    const [tab, setTab] = useState(0);
    const [headerToggle, setHeaderToggle] = useState(true);

    const mainContent = () => {
        if (tab == 0)
            return <h2>Home</h2>;
        else if (tab == 1)
            return AddText();
        else if (tab == 2)
            return Library();
        return <h1>Others</h1>;
    }

    const clickMenuBtn = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // console.log(e.target); //e.target);
        // console.log(typeof e.target);
        const anchor = e.target as HTMLAnchorElement;
        // console.log(anchor.innerHTML.toString());
        const text = anchor.innerText;
        //console.log(anchor);
        //console.log(anchor.innerText);
        if (text === "Home") {
            setHeaderToggle(true);
            setTab(0);
        }
        else if (text === "Add Text") {
            setHeaderToggle(false);
            setTab(1);
        }
        else if (text === "Library") {
            setHeaderToggle(true);
            setTab(2);            
        }
    }
    return (<>
        <div className="left-part">
            <div className='menu'>
                <a href="#Home" className='menu-btn home-btn' onClick={clickMenuBtn}><span>
                    Home
                </span></a>
                <a href="#AddText" className='menu-btn' onClick={clickMenuBtn}><span>
                    Add Text
                </span></a>
                <a href="#Library" className='menu-btn' onClick={clickMenuBtn}><span>
                    Library
                </span></a>
                <a href="#Quiz" className='menu-btn' onClick={() => setTab(3)}><span>
                    Quiz
                </span></a>
                <a href="#Dictionary" className='menu-btn' onClick={() => setTab(4)}><span>
                    Dictionary
                </span></a>
                <a href="#etc" className='menu-btn' onClick={() => setTab(5)}><span>
                    etc.
                </span></a>
            </div>
        </div>
        <div className="right-part">
            {headerToggle && <Header />}
            <div className={`main-content ${headerToggle ? 'header-padding' : ''}`}>
                {mainContent()}
            </div>
        </div>
    </>);
}