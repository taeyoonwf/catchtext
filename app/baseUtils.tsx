import { BlankType, DefaultDialect, DialectIdType, Ears, LangIdType } from "./baseTypes";

export const GetRandomInt = (max: number) => Math.floor(Math.random() * max);
const EarsIndice = [0, 2, 6, 10, 14, 18, 22];
export const AnyEar = () => {
  const idx = GetRandomInt(EarsIndice.length - 1);
  return Ears.substring(EarsIndice[idx], EarsIndice[idx + 1]);
};

export const DialectWithGender = (
  langId: LangIdType|BlankType|undefined,
  isFemale: boolean|undefined
): DialectIdType|undefined => {
  if (langId !== undefined && langId in DefaultDialect) {
    if (langId === 'es')
      return isFemale ? 'es-US' : 'es-ES';
    else if (langId === 'en')
      return isFemale ? 'en-US' : 'en-GB-1';
  }
  return undefined;
}