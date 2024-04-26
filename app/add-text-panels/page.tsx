'use client'
import { LanguageIdentifier } from "../language-identifier/languageIdentifier"
import { SpeechSynthesizer } from "../speech-synthesizer/speechSynthesizer"
import AddTextMain from "./addTextMain"

export default function AddTextTestPage() {
  return (<SpeechSynthesizer><LanguageIdentifier>
    <AddTextMain paragraphKey={"AddTextTestPage"} />
  </LanguageIdentifier></SpeechSynthesizer>)
}