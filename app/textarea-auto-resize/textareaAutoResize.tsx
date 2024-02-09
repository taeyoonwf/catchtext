"use client"
import React, { ChangeEventHandler, useRef, useState, useEffect } from 'react';
import './layout.css';

interface TextareaAutoResizeProps {
    className?: string;
    value: string;
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}

export default function TextareaAutoResize({className, value, onChange}: TextareaAutoResizeProps) {
    const divWrapper = useRef<HTMLDivElement>(null);
    const [text, setText] = useState(value);
    
    useEffect(() => {
        divWrapper.current!.dataset.replicatedValue = value;
    }, []);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.currentTarget;
        setText(value);
        divWrapper.current!.dataset.replicatedValue = value;
        // onChange?.call(e);
        onChange?.call(null, e);
    };

    return (<div className={`${className !== undefined ? className : ''} grow-wrap`} ref={divWrapper}>
        <textarea onChange={handleTextChange} value={text}></textarea>
    </div>);
}