import { highlightCode } from "@/lib/highlight";

export function CodeSnippet({
  code,
  language = "text",
  filename,
}: {
  code: string;
  language?: string;
  filename?: string;
}) {
  const highlighted = highlightCode(code, language);

  return (
    <div className="code-block my-5">
      <div className="code-block-header">
        <span>{filename ?? language}</span>
        <span className="text-[0.65rem] uppercase tracking-widest text-code-blue">
          {language}
        </span>
      </div>
      <pre>
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
