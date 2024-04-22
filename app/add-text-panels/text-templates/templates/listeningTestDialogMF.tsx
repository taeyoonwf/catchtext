import { AnyEar } from "@/app/baseTypes";
import { TemplateAnnotation, TemplateInterface } from "./normal";
import { TemplateListeningTestDialogFM } from "./listeningTestDialogFM";

export const TemplateListeningTestDialogMF: TemplateInterface = {
  activeLangIds: ['en', 'es'],
  label: () => AnyEar() + " Test (Dialog M/F)",
  value: "listeningTestDialogMF",
  shortDesc:
`M : ...
F : ...
.

1. ...?
(A) ... (B) ... (C) ...
A. (C)`,
  longDesc:
`M : ...
F : ...
M : ...
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
    const [newS, newD, newA] = TemplateListeningTestDialogFM.processor(s, d);
    return [newS, newD, newA?.map((e) => {
      if (e.isMale !== undefined)
        return {isFemale: e.isMale, isMale: e.isFemale} as TemplateAnnotation;
      return e;
    })];
  },
}