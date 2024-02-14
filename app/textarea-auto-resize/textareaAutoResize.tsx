"use client"
import React, { ChangeEventHandler, useState } from 'react';
import './layout.css';
interface TextareaAutoResizeProps {
    className?: string;
    value: string;
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
    placeholder?: string;
}

export default function TextareaAutoResize({className, value, onChange, placeholder}: TextareaAutoResizeProps) {
    const [text, setText] = useState(value);
    
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.currentTarget;
        setText(value);
        onChange?.call(null, e);
    };

    return (<div data-replicated-value={text}
        className={`${className !== undefined ? className : ''} grow-wrap`}>
        <textarea onChange={handleTextChange} value={text} placeholder={placeholder}></textarea>
    </div>);
}