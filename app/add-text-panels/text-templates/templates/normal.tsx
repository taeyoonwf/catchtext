import { LangIds } from "@/app/baseTypes";

export interface TemplateInterface {
  activeLangIds: readonly string[],
  label: () => string,
  value: string,
  shortDesc: string,
  longDesc: string,
  processor: TemplateProcessor,
}

export const AnnoKeys = ['questionNum', 'isOption', 'isAnswer', 'isFemale', 'isMale'] as const;
export type AnnoKeyType = typeof AnnoKeys[number];
export type TemplateAnnotation = {[key in AnnoKeyType]?: number|boolean}
export type TemplateProcessor = {
  (sentences: string[], divider: string[]): [newSentences: string[], newDividers: string[], annotation?: TemplateAnnotation[]];
};

export const NormalProcessor: TemplateProcessor = (s, d) => [s, d];

export const TemplateNormal: TemplateInterface = {
  activeLangIds: LangIds,
  label: () => "Normal",
  value: "normal",
  shortDesc: ``,
  longDesc: ``,
  processor: NormalProcessor,
}