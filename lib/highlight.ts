import "server-only";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-graphql";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";

const ALIAS: Record<string, string> = {
  sh: "bash",
  shell: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  node: "javascript",
};

export function highlightCode(code: string, language: string): string {
  const lang = ALIAS[language] ?? language;
  const grammar = Prism.languages[lang] ?? Prism.languages[lang?.toLowerCase?.() as string];
  if (grammar) {
    return Prism.highlight(code, grammar, lang);
  }
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
