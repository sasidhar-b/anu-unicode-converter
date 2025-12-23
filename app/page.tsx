"use client";

import { useMemo, useState } from "react";
import { convertWithMap, normalizeMap } from "../lib/convert";

import anu6ToUnicodeRaw from "../maps/anu6_to_unicode.json";
import unicodeToAnu6Raw from "../maps/unicode_to_anu6.json";
import anu7ToUnicodeRaw from "../maps/anu7_to_unicode.json";
import unicodeToAnu7Raw from "../maps/unicode_to_anu7.json";

type Direction = "anu_to_unicode" | "unicode_to_anu";
type AnuVersion = "anu6" | "anu7";

function pickMap(version: AnuVersion, direction: Direction): Record<string, string> {
  if (version === "anu6") {
    return direction === "anu_to_unicode"
      ? normalizeMap(anu6ToUnicodeRaw as unknown)
      : normalizeMap(unicodeToAnu6Raw as unknown);
  }
  return direction === "anu_to_unicode"
    ? normalizeMap(anu7ToUnicodeRaw as unknown)
    : normalizeMap(unicodeToAnu7Raw as unknown);
}

export default function Page() {
  const [anuVersion, setAnuVersion] = useState<AnuVersion>("anu7");
  const [direction, setDirection] = useState<Direction>("anu_to_unicode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const map = useMemo(() => pickMap(anuVersion, direction), [anuVersion, direction]);

  const convert = () => {
    setOutput(convertWithMap(input, map));
  };

  const swap = () => {
    setDirection((d) => (d === "anu_to_unicode" ? "unicode_to_anu" : "anu_to_unicode"));
    setInput(output);
    setOutput(input);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      // no toast to keep zero-dependency; a subtle UX hint:
      alert("Copied output to clipboard.");
    } catch {
      alert("Could not copy. Please copy manually.");
    }
  };

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px 56px" }}>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>Anu ⇄ Unicode Telugu Converter</h1>
      <p style={{ color: "#555", marginTop: 0, marginBottom: 18 }}>
        Static Next.js site (GitHub Pages compatible). Choose Anu 6.0 / Anu 7.0 and convert either direction.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          alignItems: "end",
          marginBottom: 14,
        }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Anu version</span>
          <select
            value={anuVersion}
            onChange={(e) => setAnuVersion(e.target.value as AnuVersion)}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
          >
            <option value="anu6">Anu 6.0</option>
            <option value="anu7">Anu 7.0</option>
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Conversion</span>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as Direction)}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
          >
            <option value="anu_to_unicode">Anu (Non‑Unicode) → Unicode</option>
            <option value="unicode_to_anu">Unicode → Anu (Non‑Unicode)</option>
          </select>
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 style={{ fontSize: 16, margin: 0 }}>Input</h2>
            <span style={{ fontSize: 12, color: "#666" }}>
              {direction === "anu_to_unicode" ? "Paste Anu text" : "Paste Unicode text"}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text here…"
            style={{
              minHeight: 280,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              fontSize: 15,
              lineHeight: 1.5,
              resize: "vertical",
            }}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 style={{ fontSize: 16, margin: 0 }}>Output</h2>
            <span style={{ fontSize: 12, color: "#666" }}>
              {direction === "anu_to_unicode" ? "Unicode result" : "Anu result"}
            </span>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Converted text will appear here…"
            style={{
              minHeight: 280,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              fontSize: 15,
              lineHeight: 1.5,
              resize: "vertical",
              background: "#fafafa",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <button
          onClick={convert}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #111",
            background: "#111",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Convert
        </button>

        <button
          onClick={swap}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
          title="Swap direction and swap input/output"
        >
          Swap ↔
        </button>

        <button
          onClick={copyOutput}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
          disabled={!output}
          title="Copy output"
        >
          Copy output
        </button>

        <button
          onClick={clearAll}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      <details style={{ marginTop: 18 }}>
        <summary style={{ cursor: "pointer", fontWeight: 700 }}>Important: mapping files (Anu 6/7)</summary>
        <div style={{ marginTop: 10, color: "#444", lineHeight: 1.6 }}>
          <p style={{ marginTop: 0 }}>
            This site is a <b>converter engine + UI</b>. The accuracy depends entirely on the Anu mapping tables.
          </p>
          <p>
            Replace these JSON files with the real mappings (keys = Anu sequences, values = Unicode, and vice‑versa):
          </p>
          <ul>
            <li><code>maps/anu6_to_unicode.json</code></li>
            <li><code>maps/unicode_to_anu6.json</code></li>
            <li><code>maps/anu7_to_unicode.json</code></li>
            <li><code>maps/unicode_to_anu7.json</code></li>
          </ul>
          <p style={{ marginBottom: 0 }}>
            Tip: mappings should include <b>multi-character keys</b> where needed. This project uses a greedy longest-match
            algorithm to handle that.
          </p>
        </div>
      </details>

      <p style={{ marginTop: 16, color: "#666", fontSize: 13 }}>
        Note: GitHub Pages is static hosting (no PHP). This Next.js build exports to static HTML (works on Pages).
      </p>
    </main>
  );
}
