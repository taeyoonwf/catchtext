"use client"
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin, useGoogleOneTapLogin, googleLogout } from '@react-oauth/google';
import { hasGrantedAllScopesGoogle, TokenResponse, CredentialResponse } from '@react-oauth/google';
import React, { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from 'jwt-decode';
import Image from 'next/image'

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
  
  const handleLogin = (credentialResponse: CredentialResponse) => {
    const obj = jwtDecode(credentialResponse.credential!);
    console.log(JSON.stringify(obj));
    setUser(obj);
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
            <GoogleOAuthProvider clientId="165295087683-6egbnuacmuad5q7bgff2i64hardk06ll.apps.googleusercontent.com">
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