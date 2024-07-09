"use client"
import React from 'react';
import CtAuthTest from './catchTextAuthTest';
import { CtAuth } from './catchTextAuth';

export default function Home() {
  return (<CtAuth>
    <CtAuthTest />
  </CtAuth>);
}