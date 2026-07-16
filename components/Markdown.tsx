import { CodeSnippet } from "./CodeSnippet";

type Block =
  | { type: "h1"; id: string; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; language: string; filename?: string; code: string };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseMarkdown(src: string): Block[] {
  const lines = src.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const meta = line.slice(3).trim();
      const lang = meta.split(" ")[0] || "text";
      const filename = meta.includes(" ")
        ? meta.slice(meta.indexOf(" ") + 1)
        : undefined;
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push({
        type: "code",
        language: lang,
        filename,
        code: code.join("\n").replace(/\n$/, ""),
      });
      continue;
    }

    if (line.startsWith("### ")) {
      const text = line.slice(4);
      blocks.push({ type: "h3", id: slugify(text), text });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      const text = line.slice(3);
      blocks.push({ type: "h2", id: slugify(text), text });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      const text = line.slice(2);
      blocks.push({ type: "h1", id: slugify(text), text });
      i++;
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("- ") &&
      !lines[i].startsWith("* ") &&
      !/^\d+\.\s/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ type: "p", text: buf.join(" ") });
  }

  return blocks;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-teal-dark"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export type TocEntry = { id: string; title: string; level: number };

export function Markdown({
  content,
}: {
  content: string;
}): { toc: TocEntry[]; node: React.ReactNode } {
  const blocks = parseMarkdown(content);
  const toc: TocEntry[] = [];

  const node = (
    <div className="space-y-5">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h1":
            toc.push({ id: block.id, title: block.text, level: 1 });
            return (
              <h1 key={idx} id={block.id} className="font-display text-3xl font-semibold">
                {block.text}
              </h1>
            );
          case "h2":
            toc.push({ id: block.id, title: block.text, level: 2 });
            return (
              <h2
                key={idx}
                id={block.id}
                className="scroll-mt-24 font-display text-2xl font-semibold"
              >
                {block.text}
              </h2>
            );
          case "h3":
            toc.push({ id: block.id, title: block.text, level: 3 });
            return (
              <h3
                key={idx}
                id={block.id}
                className="scroll-mt-24 font-display text-xl font-semibold"
              >
                {block.text}
              </h3>
            );
          case "p":
            return (
              <p key={idx} className="leading-7 text-ink-soft">
                {renderInline(block.text)}
              </p>
            );
          case "ul":
            return (
              <ul key={idx} className="list-disc space-y-1.5 pl-5 text-ink-soft">
                {block.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={idx} className="list-decimal space-y-1.5 pl-5 text-ink-soft">
                {block.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ol>
            );
          case "code":
            return (
              <CodeSnippet
                key={idx}
                code={block.code}
                language={block.language}
                filename={block.filename}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );

  return { toc, node };
}
