// lib/convert.ts

export type CharMap = Record<string, string>;

type TrieNode = {
  children: Record<string, TrieNode>;
  value?: string;
};

function makeNode(): TrieNode {
  return { children: Object.create(null) as Record<string, TrieNode> };
}

function buildTrie(map: CharMap): TrieNode {
  const root = makeNode();

  for (const [key, value] of Object.entries(map)) {
    let node = root;
    for (const ch of key) {
      node.children[ch] ??= makeNode();
      node = node.children[ch];
    }
    node.value = value;
  }

  return root;
}

/**
 * Greedy longest-match conversion (supports multi-char legacy sequences)
 */
export function convertGreedy(input: string, map: CharMap): string {
  if (!input) return "";

  const trie = buildTrie(map);
  let out = "";
  let i = 0;

  while (i < input.length) {
    let node: TrieNode | undefined = trie;
    let j = i;

    let lastMatch: string | undefined;
    let lastIndex = -1;

    while (node && j < input.length) {
      const ch = input[j];
      const childNode: TrieNode | undefined = node.children[ch]; // <-- typed
      if (!childNode) break;

      node = childNode;

      if (node.value !== undefined) {
        lastMatch = node.value;
        lastIndex = j;
      }
      j++;
    }

    if (lastMatch !== undefined) {
      out += lastMatch;
      i = lastIndex + 1;
    } else {
      out += input[i];
      i++;
    }
  }

  return out;
}
