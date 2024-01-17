import './layout.css';
import { useState } from 'react';

export default function Header() {
    const [text, setText] = useState("");

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

    return (
    <header className="top-part">
        <div className="top-side-left"></div>
        <div className="top-center">
            {centerBar()}
        </div>
        <div className="top-side-right"></div>
    </header>);
}