"use client"
import React, { useContext, useEffect, useState } from 'react';
import { CtAuthContext } from './catchTextAuth';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { GithubAuthProvider, GoogleAuthProvider, User, getAuth, onAuthStateChanged, signInWithCredential, signInWithPopup, signOut } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';

interface UserInfo {
  name?: string,
  email?: string,
  photoURL: string,
  uid: string,
  authProvider: string,
}

export default function CtAuthTest() {
  const { GetUser, SetUser, GetDB } = useContext(CtAuthContext);
  const SwitchSignIn = () => {
  }
  const [user, setUser] = useState<UserInfo | null>(null);
  // const [authProvider, setAuthProvider] = useState("");
  const [uidInInput, setUidInInput] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        //const uid = user.uid;
        //console.log(`uid: ${uid}`);
        console.log(user);
        const u = user;

        const token = await user.getIdToken();
        const obj = jwtDecode(token);
        console.log(JSON.stringify(obj));
        const tokenParsed = JSON.parse(JSON.stringify(obj));
        let provider = "";
        if ('firebase' in tokenParsed && 'sign_in_provider' in tokenParsed['firebase']) {
          provider = tokenParsed['firebase']['sign_in_provider'];
        }
        setUser({
          ...(u.displayName !== null ? {name: u.displayName} : {}),
          ...(u.email !== null ? {email: u.email} : {}),
          uid: u.uid,
          photoURL: u.photoURL,
          authProvider: provider,
        } as UserInfo)
      } else {
        // User is signed out
        // ...
        setUser(null);
        console.log('signed out');
      }
    });
  }, []);

  const doit7 = async (user: User, providerPrefix: string, provider: string) => {
    const db = GetDB();
    if (db === null)
      return;
    const citiesRef = collection(db, "users");
    console.log(user);
    const myDoc = await setDoc(doc(citiesRef, providerPrefix + ':' + user.uid), {
      ...(user.displayName !== null ? {name: user.displayName} : {}),
      ...(user.email !== null ? {email:user.email} : {}),
      profile: user.photoURL, authProvider: provider });
    console.log(myDoc);
    console.log(user);
  };

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
      await doit7(result.user, credential.providerId.slice(0, 2), credential.providerId);
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
      await doit7(result.user, credential.providerId.slice(0, 2), credential.providerId);
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
      /*if (user?.authProvider === 'google') {
        googleLogout();
      }
      else if (user?.authProvider === 'github') { */
        const auth = getAuth();
        signOut(auth).then(() => {
          // Sign-out successful.
          console.log('sign out');
        }).catch((error) => {
          // An error happened.
          console.log('sign out fail');
        });
      //}
      setUser(null);
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
       {(user !== null) && <>
       <br/>
              <button onClick={() => logout()}>
          <img src={user.photoURL} width={38} height={38}/>
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
    if (db === null)
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
      {user && user.uid}
      <br/>
      UID<input onChange={(e) => handleUidChange(e.currentTarget.value)} />
      <br/>
      TEXT<input onChange={(e) => handleTextChange(e.currentTarget.value)}/>
      <br/>
      <button onClick={requestWriting}>Request writing text with Uid of the input</button>
  </>);
}
