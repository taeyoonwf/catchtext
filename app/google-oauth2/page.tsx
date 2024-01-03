"use client"
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin, useGoogleOneTapLogin, googleLogout } from '@react-oauth/google';
import { hasGrantedAllScopesGoogle, TokenResponse, CredentialResponse } from '@react-oauth/google';
import React, { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from 'jwt-decode';
import Image from 'next/image'
import { DocumentData, Firestore, Timestamp, collection, getDocs, getFirestore, query } from 'firebase/firestore';
import { getAuth, signInWithCredential, GoogleAuthProvider, signInWithCustomToken } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import FirebaseConfig from './firebase-config';

declare interface PhraseData {
  /** A mapping between a field and its value. */
      Created: Timestamp,
      Text: string,
      TextLangId: string,
      TtsRunningTime: number,
      Paragraph: string,
      Speed: number,
      Translation: {[langId: string]: string},
  }

  declare interface PhraseDataShortKey {
      /** A mapping between a field and its value. */
          C: Timestamp,
          T: string,
          L: string,
          R: number,
          G: string,
          S: number,
          TR: {[langId: string]: string},
      }
      
export default function Home() {
  //const [credentialResponse, setCredentialResponse] = useState<CredentialResponse | null>(null);
  const [user, setUser] = useState<JwtPayload | null>(null);
  // const [tokenResponse, JwtPayloadsetTokenResponse] = useState<TokenResponse | null>();
  /* const hasAccess = hasGrantedAllScopesGoogle(
    tokenResponse,import jwtDecode from 'jwt-decode';
    'google-scope-1',
    'google-scope-2',
  ); */
  //console.log(`credentialResponse : ${credentialResponse}`);
  const app = initializeApp(FirebaseConfig);
//const analytics = getAnalytics(app);
  const db: Firestore = getFirestore(app);

  const doit6 = async () => {
    const usersCollectionRef = collection(db, 'Users', 'GYuojO5gZNXVZEAtd1BD', 'Phrases');
    const q = query(usersCollectionRef);
    const querySnapshot = await getDocs(q);
    
    let phraseData: PhraseData|undefined;
    let phraseShortData: PhraseDataShortKey|undefined;
    let dataList: any;

    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
        const docData: DocumentData = doc.data();
        // console.log(JSON.stringify(docData));
        if ('Translation' in docData) {
            const tmp: PhraseData = docData as PhraseData;
            if (Object.keys(tmp.Translation).length > 1) {
                phraseData = tmp;
                //console.log('here');
                phraseShortData = {
                    C: tmp.Created,
                    T: tmp.Text,
                    TR: tmp.Translation,
                    L: tmp.TextLangId,
                    R: tmp.TtsRunningTime,
                    G: tmp.Paragraph,
                    S: tmp.Speed
                }
            }
        }
        if ('data' in docData) {
            dataList = doc.ref;
            console.log(`current length : ${docData['data'].length}`)
            //docData['newKey'] = Array(10000).fill(3);
            //setDoc(dataList, docData, { merge: true });
        }
    });
    //console.log(phraseData);
    //console.log(dataArray);

    if (phraseData !== undefined && dataList !== undefined) {
        // setDoc(dataList, {data: Array(4386).fill(phraseData)}, { merge: true });
        // setDoc(dataList, {data: Array(43).fill(phraseData)}, { merge: true });
        //setDoc(dataList, {data: Array(5600).fill(phraseShortData)}, { merge: true });
    }
  }

  const handleLogin = (credentialResponse: CredentialResponse) => {
    const obj = jwtDecode(credentialResponse.credential!);
    console.log(JSON.stringify(obj));
    setUser(obj);
    
    const auth = getAuth();
    console.log(credentialResponse.clientId);
    console.log(credentialResponse.credential);
    const credential = GoogleAuthProvider.credential(credentialResponse.credential);
    signInWithCredential(auth, credential).then((result) => {
      // User signed in to Firebase, now you can perform actions in Firestore
      doit6();
    }).catch((error) => {
      console.log(`error occurs`);
      console.log(error);
      // Handle errors
    });
    //setCredentialResponse(credentialResponse);
  }
  
  const loginUI = () => {
   //if (tokenResponse && hasGrantedAllScopesGoogle(tokenResponse, 'google-scope-1',
   // 'google-scope-2')) {
    //if (true) {
    //  return <button type="button" onClick={onetap}>Google Login</button>
    //}
    if (user) {
      return (
        <Image
        src={JSON.parse(JSON.stringify(user))["picture"]}
        alt="Profile Image"
        width={38}
        height={38}
        unoptimized
        />
      );
    }
      return (
        <GoogleLogin useOneTap={true} auto_select={false} type='icon'
onSuccess={handleLogin}
onError={() => {
console.log('Login Failed');
}}
/>);
    }
    //return (

//    );
 // };


  return (
        <main className="flex min-h-screen flex-col items-center justify-between p-8">
            <GoogleOAuthProvider clientId="386799757866-es20djfdca1c090mht8sfhk21aesb1gk.apps.googleusercontent.com">
                <div>
                    {loginUI()}
                </div>
<div>
<button type="button" onClick={() => {
  console.log("logout!");
  googleLogout();
  setUser(null);
  //setCredentialResponse(null);
  }}>Google Logout</button>

</div>
            </GoogleOAuthProvider>
        </main>
    );
};