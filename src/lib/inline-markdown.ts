// Minimal inline markdown parser: *bold* and _italic_
// Output is safe HTML (input is HTML-escaped before applying markdown).

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Matches *text* where text has no leading/trailing whitespace and no `*` inside.
// Allows either multi-char (with non-space boundaries) or single non-space char.
const BOLD_RE = /\*([^\s*][^*\n]*?[^\s*]|[^\s*])\*/g;

// Same for _italic_
const ITALIC_RE = /_([^\s_][^_\n]*?[^\s_]|[^\s_])_/g;

export function parseInlineMarkdown(text: string): string {
  const escaped = escapeHtml(text);
  return escaped
    .replace(BOLD_RE, "<strong>$1</strong>")
    .replace(ITALIC_RE, "<em>$1</em>");
}

// Non-global versions for `.test()` (global regexes have stateful lastIndex).
const BOLD_TEST = /\*([^\s*][^*\n]*?[^\s*]|[^\s*])\*/;
const ITALIC_TEST = /_([^\s_][^_\n]*?[^\s_]|[^\s_])_/;

export function hasInlineMarkdown(text: string): boolean {
  return BOLD_TEST.test(text) || ITALIC_TEST.test(text);
}
