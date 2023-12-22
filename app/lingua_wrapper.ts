import * as lingua from './lingua-rs-pkg'
let detector: null|lingua.LanguageDetector = null;

export default async function load(input: {init: boolean, text: string}) {
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
      return detector.computeLanguageConfidenceValues(input.text)
    }
    return true;
}

addEventListener('message', async (event: MessageEvent<{init: boolean, text: string}>) => {
    postMessage(await load(event.data))
});

