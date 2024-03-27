"use client"
import React, { CSSProperties, ChangeEventHandler, useState } from 'react';
import './layout.css';
interface TextareaAutoResizeProps {
    className?: string;
    value: string;
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
    placeholder?: string;
    readOnly?: boolean;
    backgroundColor?: CSSProperties['backgroundColor'];
}

export default function TextareaAutoResize({className, value, onChange, placeholder, readOnly, backgroundColor}: TextareaAutoResizeProps) {
    const [text, setText] = useState(value);
    
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.currentTarget;
        setText(value);
        onChange?.call(null, e);
    };

    return (<div data-replicated-value={text}
        className={`${className !== undefined ? className : ''} grow-wrap`}>
        <textarea
            onChange={handleTextChange}
            value={text}
            placeholder={placeholder}
            readOnly={readOnly}
            style={backgroundColor !== undefined ? {backgroundColor} : {}}
        ></textarea>
    </div>);
}