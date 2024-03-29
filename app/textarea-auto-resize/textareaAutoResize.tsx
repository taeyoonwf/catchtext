"use client"
import React, { CSSProperties, ChangeEventHandler, useEffect, useState } from 'react';
import './layout.css';
export interface TextareaAutoResizeProps {
    className?: string;
    value?: string;
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
    placeholder?: string;
    readOnly?: boolean;
    backgroundColor?: CSSProperties['backgroundColor'];
}

export default function TextareaAutoResize({
    className,
    value,
    onChange,
    placeholder,
    readOnly: readOnlyProp,
    backgroundColor: backgroundColorProp
}: TextareaAutoResizeProps) {
    const [text, setText] = useState(value === undefined ? '': value);
    const [readOnly, setReadOnly] = useState(readOnlyProp !== undefined ? readOnlyProp : false);
    const [backgroundColor, setBackgroundColor] = useState(backgroundColorProp);

    useEffect(() => {
        console.log(`value readOnlyProp backgroundColorProp`);
        console.log(`${value} ${readOnlyProp} ${backgroundColorProp}`);
        if (value !== undefined && value !== text)
            setText(value);
        setReadOnly(readOnlyProp === true);
        setBackgroundColor(backgroundColorProp);
    }, [value, readOnlyProp, backgroundColorProp]);
    
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