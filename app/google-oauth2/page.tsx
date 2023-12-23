"use client"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function Home() {
        return (
        <main className="flex min-h-screen flex-col items-center justify-between p-8">
            <GoogleOAuthProvider clientId="165295087683-6egbnuacmuad5q7bgff2i64hardk06ll.apps.googleusercontent.com">
                <div>
            <GoogleLogin
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>
</div>
            </GoogleOAuthProvider>
        </main>
    );
};