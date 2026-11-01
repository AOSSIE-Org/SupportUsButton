import { describe, expect, it } from "vitest";
import { scopeCss, scopeSelector } from "./scope-css.mjs";

const W = ":where(.sub-root, .sub-root *)";

describe("scopeSelector", () => {
    it("moves theme variables from :root and :host to the component root", () => {
        expect(scopeSelector(":root")).toBe(".sub-root");
        expect(scopeSelector(":host")).toBe(".sub-root");
        expect(scopeSelector("html")).toBe(".sub-root");
    });

    it("limits utilities to the component root and its descendants", () => {
        expect(scopeSelector(".flex")).toBe(`.flex${W}`);
        expect(scopeSelector(".md\\:flex-row")).toBe(`.md\\:flex-row${W}`);
        expect(scopeSelector(":where(.space-y-4 > :not(:last-child))")).toBe(
            `:where(.space-y-4 > :not(:last-child))${W}`,
        );
    });

    it("keeps pseudo-elements last", () => {
        expect(scopeSelector(".placeholder\\:x::placeholder")).toBe(
            `.placeholder\\:x${W}::placeholder`,
        );
        expect(scopeSelector("*")).toBe(`*${W}`);
        expect(scopeSelector(":before")).toBe(`${W}:before`);
        expect(scopeSelector("::backdrop")).toBe(`${W}::backdrop`);
    });

    it("ignores pseudo-elements inside parentheses", () => {
        expect(scopeSelector(".a:is(.b::before)")).toBe(
            `.a:is(.b::before)${W}`,
        );
    });
});

describe("scopeCss", () => {
    it("scopes every rule, including nested ones, but not keyframe steps", () => {
        const out = scopeCss(
            ":root,:host{--font-sans:x}" +
                "@media (width>=768px){.md\\:p-4{padding:1rem}}" +
                "@keyframes sub-fade{from{opacity:0}to{opacity:1}}" +
                "*,:before{--tw-x:initial}",
        );
        expect(out).toContain(".sub-root{--font-sans:x}");
        expect(out).toContain(`.md\\:p-4${W}{padding:1rem}`);
        expect(out).toContain("from{opacity:0}to{opacity:1}");
        expect(out).toContain(`*${W},${W}:before{--tw-x:initial}`);
        expect(out).not.toMatch(/(^|[},])\s*:root/);
    });
});
