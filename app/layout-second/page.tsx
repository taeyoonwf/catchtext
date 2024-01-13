"use client"
import './layout.css';
import AddText from './addtext';
import Library from './library';
import { useState } from 'react';

export default function Home() {
    const [tab, setTab] = useState(0);
    const [text, setText] = useState("");

    const mainContent = () => {
        if (tab == 0)
            return <h2>Home</h2>;
        else if (tab == 1)
            return AddText();
        else if (tab == 2)
            return Library();
        return <h1>Others</h1>;
    }

    const handleSubmit = () => {};
    const handleTextChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        setText(value);
    };

    const centerBar = () => {
        return (<form className='form-text-bar' onSubmit={handleSubmit}>
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
            />
            </form>
      );
    }
    return (<>
        <div className="left-part">
            <div className='menu'>
                <a href="#Home" className='menu-btn home-btn' onClick={() => setTab(0)}><span>
                    Home
                </span></a>
                <a href="#AddText" className='menu-btn' onClick={() => setTab(1)}><span>
                    Add Text
                </span></a>
                <a href="#Library" className='menu-btn' onClick={() => setTab(2)}><span>
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
            <header className="top-part">
                <div className="top-side-left"></div>
                <div className="top-center">
                    {centerBar()}
                </div>
                <div className="top-side-right"></div>
            </header>
            <div className='main-content'>
                {mainContent()}
            </div>
        </div>
    </>
    );
}