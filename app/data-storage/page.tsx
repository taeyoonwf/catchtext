"use client"
import React from 'react';
import DataStorageTest from './dataStorageTest';
import { DataStorage } from './dataStorage';

export default function Home() {
  return (<DataStorage>
    <DataStorageTest />
  </DataStorage>);
}