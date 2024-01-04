"use client"
import { initializeApp } from 'firebase/app';
import { Firestore, getDoc, doc, query, setDoc, getFirestore, collection, getDocs, Timestamp, DocumentData } from 'firebase/firestore';
//import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAnalytics } from "firebase/analytics";
import { useEffect, useState } from 'react';
import firebaseConfig from '../config/firebase-config';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db: Firestore = getFirestore(app);


async function doit() {
    const citiesRef = collection(db, "cities");
    await setDoc(doc(citiesRef, "SF"), {
      name: "San Francisco", state: "CA", country: "USA",
      capital: false, population: 860000,
      regions: ["west_coast", "norcal"] });
  
}

//doit();

    const doit2 = () => {
        const userDataRef = doc(db, 'Users', 'GYuojO5gZNXVZEAtd1BD')
        getDoc(userDataRef).then((userData) => {
            //console.log(JSON.stringify(userData, null, 2));
            if (userData.exists()) {
                const docData = userData.data();
                console.log(JSON.stringify(docData, null, 2));
                //setTest(JSON.stringify(docData));
            }    
        });
      
    }

    const doit3 = () => {
  // /Users/GYuojO5gZNXVZEAtd1BD/Phrases/yoYe4xvEfNutgIGgujo0
  const userDataPhraseRef = doc(db, 'Users', 'GYuojO5gZNXVZEAtd1BD', 'Phrases', 'yoYe4xvEfNutgIGgujo0')
  getDoc(userDataPhraseRef).then((userData) => {
      //console.log(JSON.stringify(userData, null, 2));
      if (userData.exists()) {
          const docData = userData.data();
          console.log(JSON.stringify(docData, null, 2));
          //setTest(JSON.stringify(docData));
      }    
  });

    }

  const doit4 = async () => {
    const usersCollectionRef = collection(db, 'Users', 'GYuojO5gZNXVZEAtd1BD', 'Phrases');
    const q = query(usersCollectionRef);
    const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
  }

//doit4();

const doit5 = async () => {
    const userDataPhraseRef = doc(db, 'Users', 'GYuojO5gZNXVZEAtd1BD')
    getDoc(userDataPhraseRef).then((userData) => {
        const docData = userData.data();
        console.log(JSON.stringify(docData, null, 2));
  });  
  }

  //doit5();

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
    
    /*
    */
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

    doit6();