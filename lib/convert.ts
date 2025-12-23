export type MapDict = Record<string, string>;

type TrieNode = {
  children: Record<string, TrieNode>;
  value?: string;
};

function buildTrie(map: MapDict): TrieNode {
  const root: TrieNode = { children: {} };
  for (const [k, v] of Object.entries(map)) {
    if (!k) continue;
    let node = root;
    for (const ch of k) {
      node.children[ch] ??= { children: {} };
      node = node.children[ch];
    }
    node.value = v;
  }
  return root;
}

/**
 * Convert using a greedy, longest-match strategy.
 * This is important because many legacy-font encodings use multi-character sequences.
 */
export function convertWithMap(input: string, map: MapDict): string {
  const trie = buildTrie(map);
  let out = "";
  let i = 0;

  while (i < input.length) {
    let node: TrieNode | undefined = trie;
    let j = i;

    let lastValue: string | undefined = undefined;
    let lastJ = i;

    while (node && j < input.length) {
      const ch = input[j];
      const next = node.children[ch];
      if (!next) break;

      node = next;
      j++;

      if (node.value !== undefined) {
        lastValue = node.value;
        lastJ = j;
      }
    }

    if (lastValue !== undefined) {
      out += lastValue;
      i = lastJ;
    } else {
      out += input[i];
      i++;
    }
  }

  return out;
}

/**
 * Maps in this project are JSON files. We allow an optional _meta key and will ignore it.
 * Also filters out any non-string keys/values just to be safe.
 */
export function normalizeMap(raw: unknown): MapDict {
  if (!raw || typeof raw !== "object") return {};
  const out: MapDict = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!k || k.startsWith("_")) continue;
    if (typeof v !== "string") continue;
    out[k] = v;
  }
  return out;
}
