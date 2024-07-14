"use client"
import React, { useContext, useState } from 'react';
import { CtAuthContext } from './catchTextAuth';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { GithubAuthProvider, GoogleAuthProvider, getAuth, signInWithCredential, signInWithPopup } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';

export default function CtAuthTest() {
  const { GetUser, SignIn, GetDB, SignOut } = useContext(CtAuthContext);
  const [uidInInput, setUidInInput] = useState('');
  const [text, setText] = useState('');

  const googleHandleLogin = (credentialResponse: CredentialResponse) => {
    const obj = jwtDecode(credentialResponse.credential!);
    console.log(JSON.stringify(obj));

    console.log(credentialResponse.clientId);
    console.log(credentialResponse.credential);
    const credential = GoogleAuthProvider.credential(credentialResponse.credential);
    const auth = getAuth();
    signInWithCredential(auth, credential).then(async (result) => {
      console.log(result);
      console.log('sign in succeeded');
      const u = result.user;
      await SignIn({
        ...(u.displayName !== null ? {name: u.displayName} : {}),
        ...(u.email !== null ? {email: u.email} : {}),
        photoURL: u.photoURL!,
        authProvider: credential.providerId,
        uid: u.uid
      });
      //await doit7(result.user, credential.providerId.slice(0, 2), credential.providerId);
    }).catch((error) => {
      console.log(`error occurs`);
      console.log(error);
      // Handle errors
    });
    //setCredentialResponse(credentialResponse);
  }
  
	const githubHandleLogin = async() => {
    //const credential = GithubAuthProvider.credential(response);
    const auth = getAuth();
    const provider = new GithubAuthProvider();
    provider.addScope('read:user')
    provider.setCustomParameters({
      'allow_signup': 'false'
    });

    signInWithPopup(auth, provider)
  .then(async (result) => {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    console.log(result);
    const credential = GithubAuthProvider.credentialFromResult(result);
    console.log(credential);
    if (credential !== null) {
      //await doit7(result.user, credential.providerId.slice(0, 2), credential.providerId);
      const u = result.user;
      await SignIn({
        ...(u.displayName !== null ? {name: u.displayName} : {}),
        ...(u.email !== null ? {email: u.email} : {}),
        photoURL: u.photoURL!,
        authProvider: credential.providerId,
        uid: u.uid
      });
    }
  }).catch(async (error) => {
    // Handle Errors here.
    const errorCode = error.code;
    console.log(errorCode);
    const errorMessage = error.message;
    console.log(errorMessage);
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GithubAuthProvider.credentialFromError(error);
    // ...
      console.log(email);
      console.log(credential);
      if (errorCode === 'auth/account-exists-with-different-credential') {
        console.log('here');
      }
    });
  }

  const logout = () => {
    if (confirm('Are you sure you want to log out?')) {
      SignOut();
    }
  }

  const loginUI = () => {
      return (<>
        <GoogleLogin useOneTap={false} auto_select={false} type='icon'
         onSuccess={googleHandleLogin}
         onError={() => {
         console.log('Login Failed');
       }} />
       <button onClick={githubHandleLogin}>Sign in with Github</button>
       {(GetUser() !== null) && <>
       <br/>
              <button onClick={() => logout()}>
          <img src={GetUser()?.photoURL} width={38} height={38}/>
        </button></>}
       </>
     );
   }

  const handleUidChange = (value: string) => {
    setUidInInput(value);
  }

  const handleTextChange = (value: string) => {
    setText(value);
  }

  const requestWriting = async () => {
    const db = GetDB();
    const user = GetUser();
    if (db === null || user === null)
      return;

    const citiesRef = collection(db, "users");
    console.log(user);

    const myDoc = await setDoc(doc(citiesRef, user?.authProvider.slice(0, 2) + ':' + uidInInput), {
      ...(text !== '' ? {text: text} : {})
      }, { merge: true});
  }

  return (<>
      {loginUI()}
      <br/>
      {GetUser() && GetUser()?.uid}
      <br/>
      UID<input onChange={(e) => handleUidChange(e.currentTarget.value)} />
      <br/>
      TEXT<input onChange={(e) => handleTextChange(e.currentTarget.value)}/>
      <br/>
      <button onClick={requestWriting}>Request writing text with Uid of the input</button>
  </>);
}
