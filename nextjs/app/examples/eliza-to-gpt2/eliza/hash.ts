// SLIP's HASH(D,N) and the IBM 7094 character code it hashed. ELIZA uses it to choose which MEMORY transformation to
// apply: line 001230 of the 1965 listing is I=HASH.(BOT.(INPUT),2)+1, a 2-bit hash of the last word of the input.
// The paper says the choice is random (p. 41); the listing shows it is not. Ported to TypeScript from
// ll-26-27/eng298ai-20261020 nextjs/lib/eliza/hash.mjs, which follows Anthony Hay's reading (github.com/anthay/ELIZA).

// 7090 BCD ("Hollerith") codes, six bits each; the index is the code. Code 014 is the prime (').
const BCD = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "", "=", "'", "", "", "",
  "+", "A", "B", "C", "D", "E", "F", "G", "H", "I", "", ".", ")", "", "", "",
  "-", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "", "$", "*", "", "", "",
  " ", "/", "S", "T", "U", "V", "W", "X", "Y", "Z", "", ",", "(", "", "", "",
];
const CODE = new Map<string, number>(BCD.flatMap((c, i): [string, number][] => (c ? [[c, i]] : [])));

// A SLIP cell held six characters, left-justified and space-padded; BOT returns the last cell of a longer word.
export function lastCellAsBcd(word: string): bigint {
  const start = word.length ? Math.floor((word.length - 1) / 6) * 6 : 0;
  const cell = word.slice(start).padEnd(6, " ");
  let datum = BigInt(0);
  for (const c of cell) datum = (datum << BigInt(6)) | BigInt(CODE.get(c) ?? (c.charCodeAt(0) & 0x3f));
  return datum;
}

// The middle n bits of d squared (d taken as a 35-bit magnitude: the 36th bit was the sign).
export function hash(datum: bigint, n: number): number {
  let d = datum & BigInt(0x7ffffffff);
  d *= d;
  d >>= BigInt(35 - Math.floor(n / 2));
  return Number(d & ((BigInt(1) << BigInt(n)) - BigInt(1)));
}
