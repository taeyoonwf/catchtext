import { AnyEar } from "@/app/baseTypes";
import { TemplateInterface } from "./normal";

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
Answer : A`,
  longDesc:
`F : ...
M : ...
F : ...
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