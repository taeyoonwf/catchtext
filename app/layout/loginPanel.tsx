import { CSSProperties } from 'react';
import './layout.css';
import Image from 'next/image'

export interface LoginPanelProps {
  position?: string;
  top?: number;
  right?: number;
}

export default function LoginPanel({
  position: positionProp,
  top: topProp,
  right: rightProp,
}: LoginPanelProps) {
  return (<span className='login-panel'
    style={{...{
      "--position-prop": positionProp ?? 'fixed',
      "--top-prop": (topProp ?? 0) + "px",
      "--right-prop": (rightProp ?? 0) + "px",
    } as CSSProperties}}
  >
    <Image
      src={`next.svg`}
      alt="Profile Image"
      width={38}
      height={38}
      unoptimized
    />
  </span>);
}