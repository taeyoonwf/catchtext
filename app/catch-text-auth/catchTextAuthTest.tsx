"use client"
import React, { useContext, useEffect, useState } from 'react';
import { CtAuthContext } from './catchTextAuth';
import { CredentialResponse, GoogleLogin, googleLogout } from '@react-oauth/google';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Auth, GithubAuthProvider, GoogleAuthProvider, User, fetchSignInMethodsForEmail, getAuth, getRedirectResult, signInWithCredential, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
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
    //setUser(obj);
    //setAuthProvider('google');

    const auth = getAuth();
    console.log(credentialResponse.clientId);
    console.log(credentialResponse.credential);
    const credential = GoogleAuthProvider.credential(credentialResponse.credential);
    signInWithCredential(auth, credential).then(async (result) => {
      // User signed in to Firebase, now you can perform actions in Firestore
      //doit6();
      const u = result.user;
      setUser({
        ...(u.displayName !== null ? {name: u.displayName} : {}),
        ...(u.email !== null ? {email: u.email} : {}),
        uid: u.uid,
        photoURL: u.photoURL,
        authProvider: 'google'
      } as UserInfo);
      await doit7(result.user, 'go', 'google');
      //await SetUser(obj)
    }).catch((error) => {
      console.log(`error occurs`);
      console.log(error);
      // Handle errors
    });
    //setCredentialResponse(credentialResponse);
  }
  
	const githubHandleLogin = async() => {
    //const credential = GithubAuthProvider.credential(response);
		console.log('asdf');
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
      const token = credential.accessToken;

      console.log(token);
      const u = result.user;
      console.log(user);
      setUser({
        ...(u.displayName !== null ? {name: u.displayName} : {}),
        ...(u.email !== null ? {email: u.email} : {}),
        uid: u.uid,
        photoURL: u.photoURL,
        authProvider: 'google'
      } as UserInfo);

      await doit7(result.user, 'gi', 'github');
      // The signed-in user info.
      // IdP data available using getAdditionalUserInfo(result)
      // ...
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
      if (user?.authProvider === 'google') {
        googleLogout();
      }
      else if (user?.authProvider === 'github') {
        const auth = getAuth();
        signOut(auth).then(() => {
          // Sign-out successful.
          console.log('sign out');
        }).catch((error) => {
          // An error happened.
          console.log('sign out fail');
        });
      }
      setUser(null);
    }
  }

  const loginUI = () => {
    if (user) {
      return (
       <button onClick={() => logout()}>
        <img src={user.photoURL} />
       </button>
      );
    }
      return (<>
        <GoogleLogin useOneTap={false} auto_select={false} type='icon'
         onSuccess={googleHandleLogin}
         onError={() => {
         console.log('Login Failed');
       }} />
       <button onClick={githubHandleLogin}>Sign in with Github</button>
       </>
     );
   }

  return (<>
      {loginUI()}
  </>);
}
