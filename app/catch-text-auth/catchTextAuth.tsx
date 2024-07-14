import React, { createContext, useEffect, useState } from "react";
import { Firestore, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { jwtDecode } from "jwt-decode";
import { initializeApp } from "firebase/app";
import { clientId, firebaseConfig } from "../config-for-publisher/firebaseConfig";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

interface UserInfo {
  name?: string,
  email?: string,
  photoURL: string,
  uid: string,
  authProvider: string,
}

interface CtAuthContextType { // CatchTextAuthContextType
  GetUser: () => UserInfo | null;
  SignIn: (userInfo: UserInfo) => Promise<void>;
  GetDB: () => Firestore | null;
  SignOut: () => void;
}

const CtAuthContext = createContext<CtAuthContextType>({ // CatchTextAuthContext
  GetUser: () => null,
  SignIn: async (userInfo) => {},
  GetDB: () => null,
  SignOut: () => {},
});

function CtAuth({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const app = initializeApp(firebaseConfig);
  const db: Firestore = getFirestore(app);

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
  
  const GetUser = () => user;
  const GetDB = () => db;

  const SignIn = async (userInfo: UserInfo) => {
    //const user = JSON.parse(JSON.stringify(jwtPayload));
    console.log(userInfo);
    console.log(db);
    const citiesRef = collection(db, "users");
    console.log(citiesRef);
    console.log(userInfo?.name);
    //console.log(user["sub"]);
    const myDoc = await setDoc(doc(citiesRef, userInfo.authProvider.slice(0, 2) + ':' + userInfo.uid), {
      ...(userInfo?.name !== undefined ? {name: userInfo.name} : {}),
      ...(userInfo?.email !== undefined ? {email: userInfo.email} : {}),
      profile: userInfo?.photoURL,
      authProvider: userInfo?.authProvider
    });
    console.log(myDoc);
  }

  const SignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log('sign out');
    }).catch((error) => {
      // An error happened.
      console.log('sign out fail');
    });
    //setUser(null);
  }

  return (
    <CtAuthContext.Provider value={{
      GetUser,
      SignIn,
      GetDB,
      SignOut,
    }}>
      <GoogleOAuthProvider clientId={clientId}>
        {children}
      </GoogleOAuthProvider>
    </CtAuthContext.Provider>
  )
}

export { CtAuth, CtAuthContext };
