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

export default function Home() {
    const [currentHash, setCurrentHash] = useState('#Home');
    const [headerToggle, setHeaderToggle] = useState(false);
    const menuText = ["Home", "Add Text", "Library", "Quiz", "Dictionary", "etc"];
    const pages = [HomePage, AddText, Library, Quiz, Dictionary, Etc];

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash);
            const pageIndex = getPageIndex(window.location.hash);
            setHeaderToggle(pageIndex == 2 || pageIndex == 4);
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

    return (<>
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
            <LoginPanel />
            <div className={`main-content ${headerToggle ? 'header-padding' : ''}`}>
                {pages[getPageIndex(currentHash)]()}
            </div>
        </div>
    </>);
}