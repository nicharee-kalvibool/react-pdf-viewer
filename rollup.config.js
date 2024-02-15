import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
// import sass from "rollup-plugin-sass";
import postcss from "rollup-plugin-postcss";
import url from "@rollup/plugin-url";
import simplevars from "postcss-simple-vars";
import nested from "postcss-nested";
import autoprefixer from "autoprefixer";
import styles from "rollup-plugin-styles";

const packageJson = require("./package.json");

export default [
    {
        input: "src/index.ts",
        output: [
            // {
            //     file: packageJson.main,
            //     format: "cjs",
            //     sourcemap: true,
            //     inlineDynamicImports: true,
            // },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
                inlineDynamicImports: true,
            },
        ],
        plugins: [
            url(),
            peerDepsExternal(),
            resolve({
                extensions: [".css"],
            }),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            terser(),
            styles({
                modules: true,
                extensions: [".css"],
                plugins: [autoprefixer(), simplevars(), nested()],
            }),
            // postcss({
            //     plugins: [autoprefixer(), simplevars(), nested()],
            //     extensions: [".css"],
            //     extract: true,
            //     sourceMap: true,
            //     // modules: {
            //     //     localsConvention: "camelCase",
            //     // },
            //     // syntax: "postcss-scss",
            //     // use: ["sass"],
            // }),
        ],
        external: ["react", "react-dom", "classnames"],
    },
    {
        input: "src/index.ts",
        output: [{ file: "dist/types.d.ts", format: "es", inlineDynamicImports: true }],
        external: [/\.(sass|scss|css)$/],
        plugins: [dts()],
    },
];
