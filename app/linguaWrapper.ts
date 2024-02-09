import * as lingua from './lingua-rs-pkg'
let detector: lingua.LanguageDetector|null = null;

export type LanguageIdentifierInputType = {
  init: boolean,
  text: string,
  id: number
};
export type LanguageIdentifierResultType = {language: string, value: number}[];
export type LanguageIdentifierOutputType = {
  id: number,
  result: LanguageIdentifierResultType
}
type LoadFunctionType = (input: LanguageIdentifierInputType) => Promise<boolean|LanguageIdentifierOutputType>;

const load: LoadFunctionType = async (input: LanguageIdentifierInputType) => {
  console.log('load start');
  const fetchData = async () => {
    const wasmModule = await fetch(new URL('lingua-rs-pkg/lingua_bg.wasm', import.meta.url));
    const moduleOrPath = await wasmModule.arrayBuffer();

    // Initialize lingua-rs
    await lingua.default(moduleOrPath);
    const detector = lingua.LanguageDetectorBuilder.fromAllLanguages().build()
    detector.computeLanguageConfidenceValues("lingua-rs is loaded.");

    return detector;
  }

  if (!detector && input.init) {
    detector = await fetchData();
  }
  if (detector && !input.init) {
    return {
      id: input.id,
      result: detector.computeLanguageConfidenceValues(input.text)
    } as LanguageIdentifierOutputType;
  }
  return true;
};

//export default async function load(input: {init: boolean, text: string}) {
//}

addEventListener('message', async (event: MessageEvent<LanguageIdentifierInputType>) => {
  console.log('qwer');
  postMessage(await load(event.data))
});

