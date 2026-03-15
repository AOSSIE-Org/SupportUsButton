import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";

import { createRequire } from "module";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

export default [
  // ===============================
  // JS Build (ESM + CJS + UMD)
  // ===============================
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.umd.js",
        format: "umd",
        name: "support-us-button",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        sourcemap: true,
      },
    ],
    external: ["react", "react-dom", "react/jsx-runtime"],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
      postcss({
        extract: "style.css",
        minimize: true,
        plugins: [require("@tailwindcss/postcss"), require("autoprefixer")],
      }),
    ],
  },
];
