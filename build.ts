import * as esbuild from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";

const _result = await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["src/index.tsx"],
  outfile: "public/bundle.js",
  bundle: true,
  format: "esm",
});

esbuild.stop();