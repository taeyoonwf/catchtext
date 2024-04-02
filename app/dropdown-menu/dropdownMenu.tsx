"use client"
import React, { useEffect, useRef, useState } from 'react';
import './layout.css';

let DropdownMenuJustClosed = false;
//let dropdownHovered = false;

interface DropdownMenuProps<Keys extends string, Blank extends string> {
    blankKey: Blank;
    selectedKey?: Keys|Blank;
    keys: readonly Keys[];
    onChange?: (newKey: Keys) => void;
}

export default function DropdownMenu<Keys extends string, Blank extends string>({
    blankKey: blankKeyProp,
    selectedKey: selectedKeyProp,
    keys: keysProp,
    onChange: onChangeProp
}: DropdownMenuProps<Keys, Blank>) {
    const [key, setKey] = useState<Keys|Blank>(selectedKeyProp !== undefined ? selectedKeyProp : blankKeyProp);
    const [keyOptions, setKeyOptions] = useState<readonly Keys[]>(keysProp);
    const [btnHover, setBtnHover] = useState(false);
    //const [stop, setStop] = useState(false);
    const selDropdownRef = useRef<HTMLSpanElement>(null);

    const onAllMouseDown = (e: any) => {
      //console.log('onAllMouseDown');
      console.log(e);
      console.log(selDropdownRef);
      const curr: Node = selDropdownRef.current as Node;
      if (btnHover && curr !== undefined) {
        console.log("compare!");
        console.log(e.target);
        console.log(curr);
        console.log(curr.childNodes[0]);
        console.log(curr.childNodes[1]);
        console.log(curr.childNodes[1].childNodes);
        let isThisCtrlEvent = (curr === e.target);
        // ||
        curr.childNodes[1].childNodes.forEach((node) => {
          isThisCtrlEvent = (isThisCtrlEvent || node === e.target);
        });
        //for (let child of ...curr.childNodes[1].childNodes)
        //  curr.childNodes[1].childNodes.)
        if (!isThisCtrlEvent || e.buttons !== 1) {
          //&& curr.childNodes[0] !== e.target
          //&& curr.childNodes[1] !== e.target) {
          console.log(`setBtnHover false`);
          setBtnHover(false);
          DropdownMenuJustClosed = true;
        }
      }
    }

    const onAllMouseUp = (e: any) => {
      DropdownMenuJustClosed = false;
    }

    useEffect(() => {
      document.addEventListener('mousedown', onAllMouseDown);
      document.addEventListener('mouseup', onAllMouseUp);
      //document.addEventListener('contextmenu', onAllContextMenu);
      return () => {
        document.removeEventListener('mousedown', onAllMouseDown);
        document.removeEventListener('mouseup', onAllMouseUp);
        //DropdownSelectorJustClosed = false;
        //document.removeEventListener('contextmenu', onAllContextMenu);
      };
    });
  
    useEffect(() => {
        console.log(`useEffect in dropdownSelector`);
        console.log(`btnHover : ${btnHover}`);
        //console.log(`stop : ${stop}`);
        console.log(`keysProp : ${keysProp}`);
        if (selectedKeyProp !== undefined) {
            setKey(selectedKeyProp);
        }
        setKeyOptions(keysProp);
    }, [keysProp, selectedKeyProp]);

    const changeLangId = (e: React.MouseEvent<HTMLButtonElement>) => {
        const newKey: Keys = e.currentTarget.innerHTML as Keys;
        //console.log(`oldKey : ${key}`);
        //console.log(`newKey : ${newKey}`);
        setKey(newKey);
        setBtnHover(false);
        //DropdownSelectorJustClosed = true;
        onChangeProp?.call(null, newKey);
    };

    return (
    <span className="sel-dropdown"
        /* onMouseMove={() => {
            setBtnHover(!stop && DropdownSelectorJustClosed != true);
            DropdownSelectorJustClosed = false;
        }}
        onMouseOut={() => {
            setBtnHover(false);
            setStop(false);
        }} */
        ref={selDropdownRef}
        onContextMenu={(e) => {
          e.preventDefault();
          e.currentTarget.dispatchEvent(new MouseEvent('click', {button: 0}));
          //console.log(`stop: ${stop}`);
          console.log(e);
          console.log(window.getSelection());
          setBtnHover(true && DropdownMenuJustClosed != true);
          //setBtnHover(!stop); // && DropdownSelectorJustClosed != true);
          //DropdownSelectorJustClosed = false;
        }}
    >
            {key}
        <div className={`${(btnHover) ? "display-block" : "display-none"} sel-dropdown-content`}>
            {keyOptions.map((theId: Keys|Blank) => (theId !== blankKeyProp &&
                <button key={theId} onClick={changeLangId}>{theId}</button>
            ))}
        </div>
    </span>);
}