import { LangIds } from "@/app/baseTypes";
import { TemplateInterface } from "./normal";
import { AnyEar } from "@/app/baseUtils";

export const TemplateListeningTestDialog1P: TemplateInterface = {
  activeLangIds: LangIds,
  label: () => AnyEar() + " Test (Dialog 1P)",
  value: "listeningTestDialog1P",
  shortDesc:
`...
.

1. ...?
(A) ... (B) ... (C) ...
Answer : C`,
  longDesc:
`... ...
... ...
...
.
.

1. ...?
(A) ... (B) ... (C) ... 
Answer : C 

2. ...?
(A) ... 
(B) ...
.
.
Answer : A

3. ...?
Answer : ...`,

  processor: (sentences: string[], dividers: string[]) => {
    //console.trace();
    //console.log(sentences);
    //console.log(dividers);
    for (let i = 0; i < sentences.length; i++) {
      console.log([dividers[i], sentences[i]]);
    }

    if (sentences.length <= 1 && dividers.length <= 1) {
      return [sentences, dividers];
    }
    const newSentences: string[] = [
      sentences[0] + dividers[0] + sentences[1],
      ...sentences.slice(2)
    ]
    const newDividers: string[] = dividers.slice(1);
    console.log(newSentences);
    console.log(newDividers);
    return [newSentences, newDividers];
    // [[sentences[0] + dividers[0] + sentences[1], ...sentences.slice(2)], dividers.slice(1)];
  }
}