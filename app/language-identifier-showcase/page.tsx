"use client"
import React from "react";
import { LanguageIdentifier } from "../language-identifier/languageIdentifier";
import TestUnit from "./testUnit";

export default function Home() {

  return (
    <LanguageIdentifier>
        <TestUnit />
    </LanguageIdentifier>
  );
}