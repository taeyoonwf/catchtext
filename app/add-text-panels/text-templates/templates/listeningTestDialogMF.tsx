import { AnyEar } from "@/app/baseTypes";
import { TemplateInterface } from "./normal";

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
Answer : A`,
  longDesc:
`M : ...
F : ...
M : ...
.
.

1. ...?
(A) ... (B) ... (C) ...
Answer : A

2. ...?
(A) ...
(B) ...
.
.
Answer : B

3. ...?
Answer : ...
`,

  processor: (s, d) => [s, d],
}