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

export type TextUnitAbbrData = {
  spd: number;
  len: number;
  txt: string;
  lid: LangIdType;
  did: DialectIdType;
  trs: string[];
  tid: string;
  prg: string;
  crt: number;
  mdf: number;
  pid: number;
};

