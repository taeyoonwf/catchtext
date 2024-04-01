export const Blank = '---' as const;
export const DialectIds = ['en-US', 'en-GB-0', 'en-GB-1', 'es-ES', 'es-US', 'zh-CN', 'zh-HK', 'zh-TW'] as const;
export type LangIdType = typeof LangIds[number];
export type BlankType = typeof Blank;
export type DialectIdType = typeof DialectIds[number];
export const DefaultDialect: {[key in LangIdType]?: DialectIdType } = {
  en: 'en-US',
  es: 'es-ES',
  zh: 'zh-CN'
};

export const LangIds = [
  'de', 'en', 'es', 'fr', 'hi', 'id', 'it',
  'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'zh'] as const;

//export type LangId = typeof langIds[number];
//export type Blank = typeof blank;

export type TextUnitData = {
  speed: number;
  length: number;
  text: string;
  langId: LangIdType;
  dialectId: DialectIdType;
  translations: string[];
  paragraphKey: string;
  created: number;
  modified: number;
  paragraphId: number;
};

export type TextUnitDataUpdate = {
  speed: number;
  length: number;
  text: string;
  langId: LangIdType;
  dialectId: DialectIdType;
  translations: string[][];
  paragraphKeyId: string;
};

export type TextUnitAbbrData = {
  spd: number;
  len: number;
  txt: string;
  lid: LangIdType;
  did: DialectIdType;
  trs: string[];
  prk: string;
  crt: number;
  mdf: number;
  pid: number;
};

export const colorSeries: string[] = [
  "#9edae5",
  "#bcbd22",
  "#e377c2",
  "#17becf",
  "#dbdb8d",
  "#7f7f7f",
  "#f7b6d2",
  "#8c564b",
  "#c7c7c7",
  "#d64748",
  "#9467bd",
  "#ff9896",
  "#98df8a",
  "#c49c94",
  "#2ca02c",
  "#ffbb78",
  "#c5b0d5",
  "#ff7f0e",
  "#aec7e8",
  "#1f77b4"];