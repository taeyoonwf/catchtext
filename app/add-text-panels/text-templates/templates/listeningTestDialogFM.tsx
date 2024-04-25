import { AnyEar } from "@/app/baseTypes";
import { TemplateAnnotation, TemplateInterface } from "./normal";

export const TemplateListeningTestDialogFM: TemplateInterface = {
  activeLangIds: ['en', 'es'],
  label: () => AnyEar() + " Test (Dialog F/M)",
  value: "listeningTestDialogFM",
  shortDesc:
`F : ...
M : ...
.

1. ...?
(A) ... (B) ... (C) ...
A. (C)`,
  longDesc:
`F : ...
M : ...
F : ...
.
.

1. ...?
(A) ... (B) ... (C) ...
A. (A)

2. ...?
(A) ...
(B) ...
.
.
A. (B)

3. ...?
A. ...
`,

  processor: (s, d) => {
    console.log(s);
    console.log(d);

    let isFsTurn = true;
    const newS: string[] = [];
    const newD: string[] = [];
    const newA: TemplateAnnotation[] = [];
    let i = 0;
    for (; i < s.length; i++) {
      const countLineBreak = (d[i].match(/\n/g) || []).length;
      if (i > 0 && countLineBreak > 0)
        isFsTurn = !isFsTurn;
      if (i > 0 && countLineBreak >= 2 && s[i].match(/^[0-9]+\.$/) !== null)
        break;

      const idPattern = /^\S+\s?[:;]\s?/;
      const identifier = idPattern.exec(s[i]);
      if (countLineBreak > 0 && identifier !== null) {
        const idLen = identifier[0].length;
        newD.push(d[i] + s[i].substring(0, idLen));
        newS.push(s[i].substring(idLen));
      }
      else {
        newD.push(d[i]);
        newS.push(s[i]);
      }
      newA.push({isFemale: isFsTurn, isMale: !isFsTurn});
      //const identifier = (s[i].match(/^\S\s?\[:;]/))
      //console.log(`${(isFsTurn ? `Female` : `Male`)}: ${s[i]}`);
    }

    const qaS: string[] = [];
    const qaD: string[] = [];
    while (i < s.length) {
      const isIncludingDoubleLineBreak = s[i].match(/\s*\n\s*\n\s*/);
      if (isIncludingDoubleLineBreak !== null) {
        const startDiv = isIncludingDoubleLineBreak.index!;
        const endDiv = startDiv + isIncludingDoubleLineBreak[0].length;
        qaD.push(d[i]);
        qaS.push(s[i].substring(0, startDiv));
        qaD.push(s[i].substring(startDiv, endDiv));
        qaS.push(s[i].substring(endDiv));
      }
      else {
        qaS.push(s[i]);
        qaD.push(d[i]);  
      }
      i++;
    }
    //newD.push(...qaD);
    //newS.push(...qaS);

    //return [newS, newD];
  
    i = 0;
    let divAdd = '';
    while (i < qaS.length) {
      if (qaS[i].match(/^[0-9]+\.$/) !== null) {
        divAdd += qaD[i] + qaS[i];
        i++;
        continue;
      }
      // console.log(d[i] + " / " + s[i]);
      newD.push(divAdd + qaD[i]);
      const isIncludingAns = qaS[i].match(/\n\s*A\.\s+/);
      const isStartingWithAns = qaS[i].match(/^\s*A\.\s*/);
      if (isIncludingAns !== null) {
        //console.log(s[i].match(/\n\s*A\.\s+/));
        const startA = isIncludingAns.index!;
        const endA = startA + isIncludingAns[0].length;
        newS.push(qaS[i].substring(0, startA));
        newD.push(qaS[i].substring(startA, endA));
        newS.push(qaS[i].substring(endA));
      }
      else if (isStartingWithAns !== null) {
        const endA = isStartingWithAns[0].length;
        newD[newD.length - 1] += qaS[i].substring(0, endA);
        newS.push(qaS[i].substring(endA));
      }
      else {
        newS.push(qaS[i]);
        divAdd = '';
      }
      i++;
    }

    let qNum = -1;
    let isQuestion = true;
    for (i = newA.length; i < newS.length; i++) {
      const countLineBreak = (newD[i].match(/\n/g) || []).length;
      if (countLineBreak >= 2 || newD[i].match(/\s*[0-9]\.\s*/)) {
        isQuestion = true;
        qNum++;
      }
      else if (newD[i].match(/\s*A\.\s*/))
        isQuestion = false;
      else if (newS[i].startsWith('(A)')) {
        newA.push({questionNum: qNum, isOption: true});
        isQuestion = false;
        continue;
      }

      if (isQuestion)
        newA.push({questionNum: qNum, isFemale: isFsTurn, isMale: !isFsTurn});
      else
        newA.push({questionNum: qNum, isAnswer: true, isFemale: isFsTurn, isMale: !isFsTurn});
    }

    console.log(newD);
    console.log(newS);
    console.log(newA);

    /* while (i < s.length) {
      let sent = s[i];
      let divi = d[i];
      while (sent.length > 0) {
        const ansIdx = sent.indexOf('\nA)');
        const queIdx = sent.indexOf('\nQ)');
        if (ansIdx >= 0 && (queIdx == -1 || ansIdx < queIdx)) {
          newD.push(divi);
          newS.push(sent.substring(0, ansIdx));
          divi = '\n';
          sent = sent.substring(ansIdx + 1);
        }
        else if (queIdx >= 0 && (ansIdx == -1 || queIdx < ansIdx)) {
          newD.push(divi);
          newS.push(sent.substring(0, queIdx));
          divi = '\n';
          sent = sent.substring(queIdx + 1);
        }
        else {
          newD.push(divi);
          newS.push(sent);
          sent = '';
        }
      }
      i++;
    }*/
    return [newS, newD, newA];
  },
}