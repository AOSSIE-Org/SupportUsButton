/**
 * Scopes the built library stylesheet to the component, so importing
 * `@aossie-org/support-us-button/style.css` cannot restyle the host page.
 *
 * - Theme variables and base styles Tailwind puts on `:root`, `:host` and `html`
 *   move to the component's root class, so the host's own `--font-sans`,
 *   `--color-*`, line height etc. are untouched.
 * - Every other rule, including Tailwind's preflight reset, only matches the
 *   component root and its descendants, via `:where()`, which keeps each
 *   selector's original specificity.
 * - `@property` registrations of Tailwind's internal `--tw-*` custom properties
 *   cannot be scoped and stay global. They only affect a host page that uses the
 *   same `--tw-*` names, i.e. one built with Tailwind itself.
 *
 * Usage: node scripts/scope-css.mjs dist/style.css
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

/** Class on the component's root element (see src/components/SupportUsButton.tsx). */
export const SCOPE_CLASS = "sub-root";

const ROOT_SELECTORS = new Set([":root", ":host", "html"]);
// Pseudo-elements must stay last in a compound selector; legacy single-colon forms included
const PSEUDO_ELEMENT =
    /::[\w-]+(\([^)]*\))?|:(before|after|first-line|first-letter)(?![\w-])/;

/** Index of the first pseudo-element outside any parentheses and quoted strings, or -1. */
function pseudoElementIndex(selector) {
    let depth = 0;
    let quote = null;
    for (let i = 0; i < selector.length; i++) {
        const ch = selector[i];
        if (ch === "\\") {
            i++;
            continue;
        }
        // Attribute values such as [title="::before"] are text, not selectors
        if (quote) {
            if (ch === quote) quote = null;
            continue;
        }
        if (ch === '"' || ch === "'") quote = ch;
        else if (ch === "(") depth++;
        else if (ch === ")") depth--;
        else if (
            ch === ":" &&
            depth === 0 &&
            PSEUDO_ELEMENT.exec(selector.slice(i))?.index === 0
        )
            return i;
    }
    return -1;
}

export function scopeSelector(selector, scopeClass = SCOPE_CLASS) {
    const s = selector.trim();
    if (ROOT_SELECTORS.has(s)) return `.${scopeClass}`;
    const where = `:where(.${scopeClass}, .${scopeClass} *)`;
    const at = pseudoElementIndex(s);
    return at === -1
        ? `${s}${where}`
        : `${s.slice(0, at)}${where}${s.slice(at)}`;
}

export function scopeCss(css, scopeClass = SCOPE_CLASS) {
    const root = postcss.parse(css);
    root.walkRules((rule) => {
        // Keyframe steps (from, to, 50%) are not selectors
        if (
            rule.parent?.type === "atrule" &&
            /keyframes$/i.test(rule.parent.name)
        )
            return;
        rule.selectors = rule.selectors.map((selector) =>
            scopeSelector(selector, scopeClass),
        );
    });
    return root.toString();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const file = process.argv[2];
    if (!file) {
        console.error("Usage: node scripts/scope-css.mjs <css file>");
        process.exit(1);
    }
    writeFileSync(file, scopeCss(readFileSync(file, "utf8")));
}
