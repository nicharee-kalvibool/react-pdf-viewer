import url from "@rollup/plugin-url";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import babel from "@rollup/plugin-babel";
// import sass from "rollup-plugin-sass";
// import postcss from "rollup-plugin-postcss";
// import styles from "rollup-plugin-styles";
import postcss from "rollup-plugin-postcss-modules";
// import autoprefixer from "autoprefixer";

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
            external(),
            url(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            terser(),
            babel({ exclude: "node_modules/**", babelHelpers: "runtime" }),
            postcss({
                extract: "main.css",
                plugins: [autoprefixer()],
            }),
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
