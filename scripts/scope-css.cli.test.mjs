import fc from "fast-check";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SCOPE_CLASS, scopeCss, scopeSelector } from "./scope-css.mjs";

const SCRIPT = fileURLToPath(new URL("./scope-css.mjs", import.meta.url));
const W = `:where(.${SCOPE_CLASS}, .${SCOPE_CLASS} *)`;
const originalArgv = process.argv;

/** Imports the script fresh, as `node scripts/scope-css.mjs ...args` would run it. */
async function runCli(...args) {
    process.argv = [process.execPath, SCRIPT, ...args];
    vi.resetModules();
    try {
        await import("./scope-css.mjs");
    } finally {
        process.argv = originalArgv;
    }
}

afterEach(() => {
    process.argv = originalArgv;
});

describe("scope-css command line", () => {
    it("rewrites the given stylesheet in place", async () => {
        const dir = mkdtempSync(join(tmpdir(), "scope-css-"));
        const file = join(dir, "style.css");
        writeFileSync(file, ":root{--x:1}.flex{display:flex}");
        try {
            await runCli(file);
            expect(readFileSync(file, "utf8")).toBe(`.${SCOPE_CLASS}{--x:1}.flex${W}{display:flex}`);
        } finally {
            rmSync(dir, { recursive: true, force: true });
        }
    });

    it("prints usage and exits with status 1 without a file", async () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => {});
        const exit = vi.spyOn(process, "exit").mockImplementation((code) => {
            throw new Error(`exit ${code}`);
        });
        await expect(runCli()).rejects.toThrow("exit 1");
        expect(error).toHaveBeenCalledWith("Usage: node scripts/scope-css.mjs <css file>");
        expect(exit).toHaveBeenCalledWith(1);
    });
});

describe("scope-css properties", () => {
    const ident = fc.stringMatching(/^[a-z][a-z0-9-]{0,10}$/);
    const pseudoElement = fc.constantFrom("", "::before", "::after", "::placeholder", ":before", "::backdrop");
    const pseudoClass = fc.constantFrom("", ":hover", ":focus-visible", ":not(.x)", ":is(.a::before)");

    it("puts the scope after the compound selector and before any pseudo-element", () => {
        fc.assert(
            fc.property(ident, pseudoClass, pseudoElement, (name, cls, element) => {
                expect(scopeSelector(`.${name}${cls}${element}`)).toBe(`.${name}${cls}${W}${element}`);
            }),
        );
    });

    it("scopes every rule outside keyframes while keeping rule count and declarations", () => {
        const rule = fc.tuple(fc.array(ident, { minLength: 1, maxLength: 3 }), ident, fc.integer({ min: 0, max: 99 }));
        fc.assert(
            fc.property(fc.array(rule, { minLength: 1, maxLength: 6 }), fc.boolean(), (rules, withKeyframes) => {
                const css =
                    rules.map(([sels, prop, v]) => `${sels.map((s) => `.${s}`).join(",")}{--${prop}:${v}}`).join("") +
                    (withKeyframes ? "@keyframes k{from{opacity:0}to{opacity:1}}" : "");
                const before = postcss.parse(css);
                const after = postcss.parse(scopeCss(css));
                const count = (root) => {
                    let n = 0;
                    root.walkRules(() => n++);
                    return n;
                };
                expect(count(after)).toBe(count(before));
                expect(after.toString().replace(/:where\([^)]*\)/g, "")).toBe(before.toString());
                after.walkRules((r) => {
                    if (r.parent?.type === "atrule") expect(r.selector).toMatch(/^(from|to)$/);
                    else for (const s of r.selectors) expect(s.endsWith(W)).toBe(true);
                });
            }),
        );
    });
});
