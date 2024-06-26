"use client"
import { CSSProperties, useState } from 'react';
import './layout.css';
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { getAuth, signInWithCredential, GoogleAuthProvider, User } from 'firebase/auth';
import { Firestore, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig, clientId } from '../config-for-publisher/firebase-config';

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
  const [user, setUser] = useState<JwtPayload | null>(null);

  const app = initializeApp(firebaseConfig);
  //const analytics = getAnalytics(app);
  const db: Firestore = getFirestore(app);

  const doit7 = async (user: User) => {
    const citiesRef = collection(db, "users");
    const myDoc = await setDoc(doc(citiesRef, 'go:' + user.uid), {
      name: user.displayName, email: user.email, profile: user.photoURL, authProvider: `google` });
    console.log(myDoc);
    //console.log(user);
  };

  const handleLogin = (credentialResponse: CredentialResponse) => {
    const obj = jwtDecode(credentialResponse.credential!);
    console.log(JSON.stringify(obj));
    setUser(obj);
    
    const auth = getAuth();
    console.log(credentialResponse.clientId);
    console.log(credentialResponse.credential);
    const credential = GoogleAuthProvider.credential(credentialResponse.credential);
    signInWithCredential(auth, credential).then(async (result) => {
      // User signed in to Firebase, now you can perform actions in Firestore
      //doit6();
      await doit7(result.user);
    }).catch((error) => {
      console.log(`error occurs`);
      console.log(error);
      // Handle errors
    });
    //setCredentialResponse(credentialResponse);
  }
  
  const logout = () => {
    if (confirm('Are you sure you want to log out?')) {
      googleLogout();
      setUser(null);
    }
  }

  const loginUI = () => {
    //if (tokenResponse && hasGrantedAllScopesGoogle(tokenResponse, 'google-scope-1',
    // 'google-scope-2')) {
     //if (true) {
     //  return <button type="button" onClick={onetap}>Google Login</button>
     //}
     if (user) {
       return (
        <button onClick={() => logout()}>
         <img src={JSON.parse(JSON.stringify(user))["picture"]} />
        </button>
       );
     }
       return (
         <GoogleLogin useOneTap={false} auto_select={false} type='icon'
          onSuccess={handleLogin}
          onError={() => {
          console.log('Login Failed');
        }} />
      );
    }

  return (<span className='login-panel'
    style={{...{
      "--position-prop": positionProp ?? 'fixed',
      "--top-prop": (topProp ?? 0) + "px",
      "--right-prop": (rightProp ?? 0) + "px",
    } as CSSProperties}}
  >
      <GoogleOAuthProvider clientId={clientId}>
        {loginUI()}
      </GoogleOAuthProvider>
  </span>);
}

