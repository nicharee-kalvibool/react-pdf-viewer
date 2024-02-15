import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";

const packageJson = require("./package.json");

export default [
    {
        input: "src/index.ts",
        output: {
            file: packageJson.module,
            format: "esm",
            sourcemap: true,
            inlineDynamicImports: true,
        },
        plugins: [
            external(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            terser(),
            postcss({
                plugins: [autoprefixer()],
                extract: true,
                minimize: true,
            }),
        ],
        external: ["react", "react-dom", "classnames", "canvas", "fs"],
    },
    {
        input: "src/index.ts",
        output: [{ file: "dist/types.d.ts", format: "es", inlineDynamicImports: true }],
        external: [/\.(sass|scss|css)$/],
        plugins: [dts()],
    },
];
