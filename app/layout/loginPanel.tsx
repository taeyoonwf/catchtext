import './layout.css';
import Image from 'next/image'

export default function LoginPanel() {
    return (<span className='login-panel'>
        <Image
        src={`next.svg`}
        alt="Profile Image"
        width={38}
        height={38}
        unoptimized
        />
    </span>);
}