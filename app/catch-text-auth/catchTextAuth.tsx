import React, { createContext, useState } from "react";
import { Firestore, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { JwtPayload } from "jwt-decode";
import { initializeApp } from "firebase/app";
import { clientId, firebaseConfig } from "../config-for-publisher/firebaseConfig";
import { GoogleOAuthProvider } from "@react-oauth/google";

interface CtAuthContextType { // CatchTextAuthContextType
  GetUser: () => JwtPayload | null;
  SetUser: (jwtPayload: JwtPayload | null) => Promise<void>;
  GetDB: () => Firestore | null;
}

const CtAuthContext = createContext<CtAuthContextType>({ // CatchTextAuthContext
  GetUser: () => null,
  SetUser: async (jwtPayload) => {},
  GetDB: () => null,
});

function CtAuth({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const app = initializeApp(firebaseConfig);
  const db: Firestore = getFirestore(app);

  const GetUser = () => user;
  const GetDB = () => db;

  const SetUser = async (jwtPayload: JwtPayload | null) => {
    setUser(jwtPayload);
    if (jwtPayload === null)
      return;

    const user = JSON.parse(JSON.stringify(jwtPayload));
    console.log(user);
    console.log(db);
    const citiesRef = collection(db, "users");
    console.log(citiesRef);
    console.log(user["sub"]);
    const myDoc = await setDoc(doc(citiesRef, 'go:' + user["sub"]), {
      name: user["name"], email: user["email"], profile: user["picture"], authProvider: `google` });
    console.log(myDoc);
    console.log(user);
  }

  return (
    <CtAuthContext.Provider value={{
      GetUser,
      SetUser,
      GetDB,
    }}>
      <GoogleOAuthProvider clientId={clientId}>
        {children}
      </GoogleOAuthProvider>
    </CtAuthContext.Provider>
  )
}

export { CtAuth, CtAuthContext };
