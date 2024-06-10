import { CSSProperties } from 'react';
import './layout.css';
import GoogleLoginIcon from '../oauth-buttons/googleIcon';

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

    <GoogleLoginIcon />
  </span>);
}