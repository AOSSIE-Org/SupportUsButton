import fc from "fast-check";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LegalDocument, parseLegalMarkdown, renderLegalInline, resolveLegalHref } from "./legal-markdown";

const links = { privacy: "/en/privacy", terms: "/en/terms" };
const SAFE = /^(https?:|mailto:|\/|#)/i;

describe("LegalDocument lists and headings", () => {
  it("renders lists, h2/h3 headings and nested bold text", () => {
    const html = renderToStaticMarkup(
      <LegalDocument
        className="legal"
        links={links}
        source={"## Data\n\n- **Bold [Privacy](./PRIVACY.md)** item\n- mail [us](mailto:a@b.c)\n\n### Small\ntext"}
      />,
    );
    expect(html).toContain('<div lang="en" class="legal">');
    expect(html).toContain("<h2>Data</h2>");
    expect(html).toContain('<ul><li><strong>Bold <a href="/en/privacy">Privacy</a></strong> item</li>');
    expect(html).toContain('<li>mail <a href="mailto:a@b.c">us</a></li></ul>');
    expect(html).toContain("<h3>Small</h3><p>text</p>");
  });

  it("starts a list right after a paragraph line", () => {
    expect(parseLegalMarkdown("Intro\n* one")).toEqual([
      { type: "paragraph", text: "Intro" },
      { type: "list", items: ["one"] },
    ]);
  });

  it("keeps plain text around inline markup", () => {
    expect(renderLegalInline("a `b` c", links)).toEqual(["a ", expect.objectContaining({ type: "code" }), " c"]);
  });
});

describe("legal-markdown properties", () => {
  const line = fc.string({ maxLength: 40 }).map((s) => s.replace(/[\r\n]/g, " "));

  it("never throws and keeps every non-blank line's words, without line breaks in the blocks", () => {
    fc.assert(
      fc.property(fc.array(fc.oneof(line, fc.constantFrom("", "# H", "## H2", "* item", "- item", "plain")), { maxLength: 15 }), (lines) => {
        const source = lines.join(fc.sample(fc.constantFrom("\n", "\r\n"), 1)[0]);
        const blocks = parseLegalMarkdown(source);
        for (const block of blocks) {
          const texts = block.type === "list" ? block.items : [block.text];
          for (const text of texts) {
            expect(text).not.toMatch(/[\r\n]/);
            expect(text.trim()).not.toBe("");
          }
        }
        const headingLines = lines.filter((l) => /^#{1,3}\s+\S/.test(l.trim()));
        expect(blocks.filter((b) => b.type === "heading")).toHaveLength(headingLines.length);
      }),
    );
  });

  it("only ever resolves links to the site's legal pages or safe URLs", () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.webUrl(), fc.constantFrom("javascript:alert(1)", "data:x", "PRIVACY.md", "./TERMS.md", "vbscript:x")), (href) => {
        const out = resolveLegalHref(href, links);
        expect(out === null || out === links.privacy || out === links.terms || SAFE.test(out)).toBe(true);
      }),
    );
  });

  it("renders link markup in any surrounding text without emitting unsafe hrefs", () => {
    fc.assert(
      fc.property(line, fc.string({ minLength: 1, maxLength: 10 }).filter((s) => !/[\]\s()]/.test(s)), (text, target) => {
        const html = renderToStaticMarkup(<LegalDocument links={links} source={`${text} [x](${target})`} />);
        for (const [, href] of html.matchAll(/href="([^"]*)"/g)) expect(href).toMatch(/^(https?:|mailto:|\/|#)/i);
      }),
    );
  });
});
