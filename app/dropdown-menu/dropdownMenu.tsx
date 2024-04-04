"use client"
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import './layout.css';

let DropdownMenuJustClosed = false;
//let dropdownHovered = false;

interface DropdownMenuProps<Items extends string> {
  items: readonly Items[];
  menuId: string;
  onSelected?: (menuId: string, item: Items, index: number, textOffset: number) => void;
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
const menuTopOffset = 8; // 8px

export default function DropdownMenu<Items extends string>({
  items: itemsProp,
  menuId: menuIdProp,
  onSelected: onSelectedProp,
  addStyle: addStyleProp,
  menuWidth: menuWidthProp,
  onMouseDown: onMouseDownProp,
  onMouseMove: onMouseMoveProp,
  children
}: DropdownMenuProps<Items>) {
  //const [key, setKey] = useState<Keys|Blank>(selectedKeyProp !== undefined ? selectedKeyProp : blankKeyProp);
  const [itemOptions, setItemOptions] = useState<readonly Items[]>(itemsProp);
  const [itemsOpened, setItemsOpened] = useState(false);
  const [menuPosOffset, setMenuPosOffset] = useState<[number, number]>([0, 0]);
  const [clickedTextOffset, setClickedTextOffset] = useState<number>(0);
  //const [stop, setStop] = useState(false);
  const selDropdownRef = useRef<HTMLSpanElement>(null);

    const onAllMouseDown = (e: MouseEvent) => {
    //console.log('onAllMouseDown');
      let isThisCtrlEvent = false; //(curr === e.target);
      //console.log(e);
      //console.log(selDropdownRef);
      const curr: Node = selDropdownRef.current as Node;
      if (itemsOpened && curr !== undefined) {
        /* console.log("compare!");
        console.log(e.target);
        console.log(curr);
        console.log(curr.childNodes[0]);
        console.log(curr.childNodes[1]);
        console.log(curr.childNodes[1].childNodes); */
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
        //console.log(`useEffect in dropdownSelector`);
        //console.log(`itemsOpened : ${itemsOpened}`);
        //console.log(`stop : ${stop}`);
        //console.log(`itemsProp : ${itemsProp}`);
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
        onSelectedProp?.call(null, menuIdProp, selItem, itemOptions.indexOf(selItem), clickedTextOffset);
    };

    const getTextOffsetFromMousePos = (textNode: ChildNode, textLen: number, x: number, y: number) => {
      const range = document.createRange();
      for (let i = 0; i < textLen; i++) {
        range.setStart(textNode, i);
        range.setEnd(textNode, i + 1);
        const bb = range.getBoundingClientRect();
        if (bb.left - 1e-4 < x && x < bb.right + 1e-4 &&
          bb.top - 1e-4 < y && y < bb.bottom + 1e-4)
          return i;
      }
      let start = 0;
      let end = textLen - 1;
      let mid = 0;
      while (start <= end) {
        mid = Math.floor((start + end) * 0.5);
        range.setStart(textNode, mid);
        range.setEnd(textNode, mid + 1);
        const chrRect = range.getBoundingClientRect();
        if (x < chrRect.top) {
          end = mid - 1;
        }
        else if (y > chrRect.bottom) {
          start = mid + 1;
        }
        else if (x < chrRect.left) {
          end = mid - 1;
        }
        else if (x > chrRect.right) {
          start = mid + 1;
        }
        else
          break;
      }
      return mid;
    }

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
          //e.currentTarget.dispatchEvent(new MouseEvent('click', {button: 0}));
          //console.log(`stop: ${stop}`);
          console.log(e);
          const x: number = e.nativeEvent.offsetX < menuWidthProp ? e.nativeEvent.offsetX : e.nativeEvent.offsetX - menuWidthProp;
          let y: number = 0;

          const textNode = e.currentTarget.firstChild;
          const textContent = textNode?.textContent;
          if (textNode !== null && typeof textContent === 'string') {
            const textOff = getTextOffsetFromMousePos(textNode, textContent.length, e.clientX, e.clientY)
            setClickedTextOffset(textOff);

            const range = document.createRange();
            range.setStart(textNode, 0);
            range.setEnd(textNode, textContent.length);
            const rect = range.getBoundingClientRect();
            console.log(rect);
            console.log(e.nativeEvent.clientY);
            y = e.nativeEvent.clientY - rect.bottom;
            //console.log(menuNode?.);
            //console.log(menuNode.eleme);
                  //console.log(`text offset: ${textOff}`);
            //range.setStart(textNode, 0);
            //range.setEnd(textNode, Math.floor(textContent.length * 0.75));
            //console.log(textContent);
            // console.log(range.getBoundingClientRect());
          }
          /* console.log(window.getSelection());
          const sel = window.getSelection();
          if (sel !== null)
            setClickedTextOffset(sel.focusOffset); */

          setMenuPosOffset([x, y + menuTopOffset]);
          setItemsOpened(true && DropdownMenuJustClosed != true);
          //setBtnHover(!stop); // && DropdownSelectorJustClosed != true);
          //DropdownSelectorJustClosed = false;
        }}
    >
            {children}
        <div
          className={`${(itemsOpened) ? "dd-menu-display-block" : "display-none"} sel-dropdown-content`}
          style={{...{
            "--menu-pos-offset-x": menuPosOffset[0] + 'px',
            "--menu-pos-offset-y": menuPosOffset[1] + 'px',
          } as CSSProperties}}
        >
            {itemOptions.map((theItem: Items) => (
                <button key={theItem} onClick={selectItem}>{theItem}</button>
            ))}
        </div>
    </span>);
}