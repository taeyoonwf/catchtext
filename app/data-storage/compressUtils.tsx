async function compress(str: string, enc: CompressionFormat) {
  const byteArray = new TextEncoder().encode(str);
  const cs = new CompressionStream(enc);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer();
}

async function decompress(byteArray: Uint8Array, enc: CompressionFormat) {
  const cs = new DecompressionStream(enc);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
      return new TextDecoder().decode(arrayBuffer);
  });
}

export async function str2compb64(str: string, enc: CompressionFormat) {
  let uint8Array = new Uint8Array(await compress(str, enc));
  let numberArray: number[] = Array.from(uint8Array);

  return btoa(String.fromCharCode(...numberArray))
}

export async function obj2compb64(obj: object, enc: CompressionFormat) {
  console.log(`stringify(obj) = ${JSON.stringify(obj)}`);
  return await str2compb64(JSON.stringify(obj), enc);
}

function base64ToArrayBuffer(base64: string) {
  var binary_string = atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++)
      bytes[i] = binary_string.charCodeAt(i);
  return bytes;
}

export async function compb64tostr(strb64: string, enc: CompressionFormat) {
  return await decompress(base64ToArrayBuffer(strb64), enc);
}

export async function compb64toobj(strb64: string, enc: CompressionFormat) {
  const str = await compb64tostr(strb64, enc);
  console.log(`stringified(obj) = ${str}`);
  return JSON.parse(str);
}