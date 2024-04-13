import { LangIds } from "@/app/baseTypes";

export interface TemplateInterface {
  activeLangIds: readonly string[],
  label: () => string,
  value: string,
  shortDesc: string,
  longDesc: string,
  processor: TemplateProcessor,
}

export type TemplateProcessor = {
  (sentences: string[], divider: string[]): [newSentences: string[], newDividers: string[]];
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