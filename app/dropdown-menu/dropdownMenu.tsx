"use client"
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import './layout.css';

let DropdownMenuJustClosed = false;
//let dropdownHovered = false;

interface DropdownMenuProps<Items extends string> {
  items: readonly Items[];
  onSelected?: (item: Items, index: number, clickedTextOffset: number) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  addStyle?: {};
  menuWidth: number;
  children: React.ReactNode;
}

/*export interface SpanWithSelColorProps {
  selColor?: string;
} 

export default function SpanWithSelColor({
  selColor: selColorProp,
*/

export default function DropdownMenu<Items extends string>({
  items: itemsProp,
  onSelected: onSelectedProp,
  menuWidth: menuWidthProp,
  addStyle: addStyleProp,
  onMouseDown: onMouseDownProp,
  onMouseMove: onMouseMoveProp,
  children
}: DropdownMenuProps<Items>) {
  //const [key, setKey] = useState<Keys|Blank>(selectedKeyProp !== undefined ? selectedKeyProp : blankKeyProp);
  const [itemOptions, setItemOptions] = useState<readonly Items[]>(itemsProp);
  const [itemsOpened, setItemsOpened] = useState(false);
  const [menuPosOffset, setMenuPosOffset] = useState<number>(0);
  const [clickedTextOffset, setClickedTextOffset] = useState<number>(0);
  //const [stop, setStop] = useState(false);
  const selDropdownRef = useRef<HTMLSpanElement>(null);

    const onAllMouseDown = (e: MouseEvent) => {
    //console.log('onAllMouseDown');
      let isThisCtrlEvent = false; //(curr === e.target);
      console.log(e);
      console.log(selDropdownRef);
      const curr: Node = selDropdownRef.current as Node;
      if (itemsOpened && curr !== undefined) {
        console.log("compare!");
        console.log(e.target);
        console.log(curr);
        console.log(curr.childNodes[0]);
        console.log(curr.childNodes[1]);
        console.log(curr.childNodes[1].childNodes);
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
          setItemsOpened(false);
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
        console.log(`itemsOpened : ${itemsOpened}`);
        //console.log(`stop : ${stop}`);
        console.log(`itemsProp : ${itemsProp}`);
        //if (selectedKeyProp !== undefined) {
        //    setKey(selectedKeyProp);
        //}
        setItemOptions(itemsProp);
    }, [itemsProp]);

    const selectItem = (e: React.MouseEvent<HTMLButtonElement>) => {
        const selItem: Items = e.currentTarget.innerHTML as Items;
        //console.log(`oldKey : ${key}`);
        //console.log(`newKey : ${newKey}`);
        //setKey(newKey);
        setItemsOpened(false);
        //DropdownSelectorJustClosed = true;
        onSelectedProp?.call(null, selItem, itemOptions.indexOf(selItem), clickedTextOffset);
    };

    return (
    <span className="dd-menu-sel-dropdown"
        /* onMouseMove={() => {
            setBtnHover(!stop && DropdownSelectorJustClosed != true);
            DropdownSelectorJustClosed = false;
        }}
        onMouseOut={() => {
            setBtnHover(false);
            setStop(false);
        }} */
        style={{...addStyleProp}}
        ref={selDropdownRef}
        onMouseDown={onMouseDownProp}
        onMouseMove={onMouseMoveProp}
        onContextMenu={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
          e.preventDefault();
          e.currentTarget.dispatchEvent(new MouseEvent('click', {button: 0}));
          //console.log(`stop: ${stop}`);
          console.log(e);
          console.log(window.getSelection());
          const x: number = e.nativeEvent.offsetX < menuWidthProp ? e.nativeEvent.offsetX : e.nativeEvent.offsetX - menuWidthProp;
          const sel = window.getSelection();
          if (sel !== null)
            setClickedTextOffset(sel.focusOffset);
          setMenuPosOffset(x);
          setItemsOpened(true && DropdownMenuJustClosed != true);
          //setBtnHover(!stop); // && DropdownSelectorJustClosed != true);
          //DropdownSelectorJustClosed = false;
        }}
    >
            {children}
        <div
          className={`${(itemsOpened) ? "dd-menu-display-block" : "display-none"} sel-dropdown-content`}
          style={{...{
            "--menu-pos-offset-x": menuPosOffset + 'px',
          } as CSSProperties}}
        >
            {itemOptions.map((theItem: Items) => (
                <button key={theItem} onClick={selectItem}>{theItem}</button>
            ))}
        </div>
    </span>);
}