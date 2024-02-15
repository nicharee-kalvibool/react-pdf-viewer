import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import nodePolyfills from "rollup-plugin-polyfill-node";

const packageJson = require("./package.json");

export default [
    {
        input: "src/index.ts",
        output: {
            file: packageJson.module,
            format: "esm",
            sourcemap: false,
            inlineDynamicImports: true,
        },
        plugins: [
            external(),
            resolve({
                browser: true,
                preferBuiltins: false,
                extensions: [".js", ".jsx"],
            }),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            terser(),
            postcss({
                plugins: [autoprefixer()],
                extract: "style.css",
                minimize: true,
            }),
            nodePolyfills(),
        ],
        external: ["react", "react-dom"],
    },
    {
        input: "src/index.ts",
        output: [{ file: "dist/types.d.ts", format: "es", inlineDynamicImports: true }],
        external: [/\.(sass|scss|css)$/],
        plugins: [dts()],
    },
];
