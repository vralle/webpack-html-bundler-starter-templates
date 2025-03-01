/**
 * Webpack configuration
 */

import { Buffer } from "node:buffer";
import { join, parse, relative } from "node:path";
import { env } from "node:process";
import { URL } from "node:url";
import sharp from "sharp";

// Plugins
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlBundlerPlugin from "html-bundler-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

// Tools
import svgToMiniDataURI from "mini-svg-data-uri";

// Configurations
import { htmlTerserConfig, postcssConfig, sharpEncodeOptions, svgoConfig, terserConfig } from "@vralle/tool-configs";
import cssMinimizerConfig from "./.webpack/plugins/cssMinimizer.config.mjs";
import projectPaths from "./configs/projectPaths.mjs";

/**
 * @typedef {import('webpack').Module} Module
 * @typedef {import('webpack').Configuration} WebpackConfig
 * @typedef {import('webpack-dev-server').Configuration} DevServerConfig
 */

// Project configuration
const projectSrcPath = projectPaths.src;
const projectOutputPath = projectPaths.output;
const outputJsDir = join(projectPaths.outputAssetDir, "js");
const outputCssDir = join(projectPaths.outputAssetDir, "css");
const isProduction = () => env["NODE_ENV"] === "production";
const PUBLIC_URL = env["PUBLIC_URL"] === undefined ? env["PUBLIC_URL"] : (new URL("/", env["PUBLIC_URL"])).href;
const imgRegExp = /\.(?:avif|gif|heif|ico|jp[2x]|j2[kc]|jpe?g|jpe|jxl|png|raw|svg|tiff?|webp)/i;

/**
 * @type {WebpackConfig & DevServerConfig}
 */
const webpackConfig = {
  mode: isProduction() ? "production" : "development",
  output: {
    publicPath: PUBLIC_URL || "auto",
    path: projectOutputPath,
    clean: true,
    crossOriginLoading: "anonymous",
    hashDigestLength: 9,
    filename: join(outputJsDir, "[name].[contenthash].js"),
    chunkFilename: join(outputJsDir, isProduction() ? "[id].[contenthash].js" : "[name].[contenthash].js"),
    cssFilename: join(outputCssDir, "[name].[contenthash].css"),
    assetModuleFilename: ({ filename }) => {
      const outputFilename = "[name][ext]";

      if (filename === undefined) {
        return join(projectPaths.outputAssetDir, outputFilename);
      }

      if (!/src\//.test(filename)) {
        return join(projectPaths.outputAssetDir, outputFilename);
      }

      // Copy the directory structure of the file path
      const relPath = relative(projectPaths.src, filename);
      const pathParts = parse(relPath);
      // Caution: Control source file names to avoid file name collisions.
      const dirPart = pathParts.dir.toLowerCase();
      const namePart = pathParts.name.toLowerCase();
      if (/\.(?:ttf|woff2?)/i.test(pathParts.ext)) {
        return join(projectPaths.outputAssetDir, dirPart, isProduction() ? "[contenthash][ext]" : `${namePart}.[contenthash][ext]`);
      }

      return join(projectPaths.outputAssetDir, dirPart, `${namePart}[ext]`);
    },
  },
  resolve: {
    alias: {
      "@src": projectSrcPath,
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js/i,
        use: {
          loader: "babel-loader",
          /** @see https://github.com/babel/babel-loader */
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.s?css/i,
        use: [
          {
            loader: "css-loader",
            /** @see https://github.com/webpack-contrib/css-loader */
            options: {
              importLoaders: isProduction() ? 1 : 0,
            },
          },
          isProduction() === true && {
            loader: "postcss-loader",
            /** @see https://github.com/webpack-contrib/postcss-loader */
            options: {
              postcssOptions: postcssConfig,
            },
          },
          {
            loader: "sass-loader",
            /** @see https://github.com/webpack-contrib/sass-loader/ */
            options: {
              implementation: "sass-embedded",
              api: "modern-compiler", // 'modern-compiler' since sass-loader v14.2.0
              webpackImporter: false, // use sass.Options.loadPaths to improve performance
              warnRuleAsWarning: true, // Treats the @warn rule as a webpack warning.
              /**
               * @see https://sass-lang.com/documentation/js-api/interfaces/options/
               * @type {import('sass-embedded').Options<"sync"|"async">} SassOptions
               */
              sassOptions: {
                loadPaths: ["node_modules", "../../node_modules"],
                style: isProduction() ? "compressed" : "expanded",
                quietDeps: true,
                silenceDeprecations: ["import"],
              },
            },
          },
        ],
      },
      {
        test: /\.svg/i,
        type: "asset/inline",
        generator: {
          /**
           * A custom data uri encoder
           * @param {Buffer|string} source
           * @returns {string}
           */
          dataUrl: (source) => {
            return svgToMiniDataURI(source.toString());
          },
        },
      },
      {
        test: imgRegExp,
        type: "asset",
        parser: {
          /**
           * Conditions for importing images as data URI
           * @param {Buffer} source
           * @param {{filename: string; module: Module;}} context
           * @returns {boolean}
           */
          dataUrlCondition(source, { filename }) {
            // Avoid inline logo import for SEO reasons
            if (/logo\.svg/i.test(filename)) {
              return false;
            }

            // Convert files to data URIs for SVG only
            if (/\.svg/i.test(filename)) {
              return Buffer.byteLength(source) <= 3 * 1024; // =maxSize: 3kb
            }

            return false;
          },
        },
      },
      {
        test: /\.(?:ttf|woff2?)/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 0, // Embed fonts if you know what you're doing
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        index: {
          import: join(projectSrcPath, "views", "home.html"),
        },
      },
      css: {
        test: /\.s?css/i,
        // webpackCfg output.cssFilename and output.hashDigestLength don't work for css. Tested with HtmlBundlerPlugin 4.10.2
        filename: join(outputCssDir, "[name].[contenthash:9].css"),
      },
      preload: [
        {
          test: /\.m?js/i,
          as: "script",
        },
      ],
      integrity: "auto",
      preprocessor: false,
      /** @see https://github.com/webdiscus/html-bundler-webpack-plugin?tab=readme-ov-file#option-loader-options */
      loaderOptions: {
        sources: [
          {
            tag: "meta",
            attributes: ["content"],
            filter: ({ value }) => imgRegExp.test(value),
          },
          {
            tag: "a",
            attributes: ["href"],
            filter: ({ value }) => imgRegExp.test(value),
          },
        ],
      },
      minify: isProduction(),
      minifyOptions: htmlTerserConfig,
      verbose: "auto",
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.[cm]?js/i,
        extractComments: false,
        parallel: true,
        terserOptions: terserConfig,
      }),
      new CssMinimizerPlugin(cssMinimizerConfig),
      new ImageMinimizerPlugin({
        test: imgRegExp,
        deleteOriginalAssets: false,
        minimizer: {
          implementation: ImageMinimizerPlugin.svgoMinify,
          options: {
            encodeOptions: svgoConfig,
          },
        },
        generator: [
          { // Convert image to webp by query `?as=webp`
            preset: "webp",
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              resize: {
                fit: sharp.fit.inside,
              },
              encodeOptions: {
                webp: sharpEncodeOptions.webp,
              },
            },
          },
        ],
      }),
    ],
  },
  devtool: isProduction() ? false : "inline-cheap-source-map",
  devServer: {
    static: {
      directory: projectOutputPath,
    },
    watchFiles: ["src/**/*.{html,scss,svg}", "dist/**/*"],
  },
  watchOptions: {
    poll: true,
    ignored: ["node_modules/**"],
  },
};

export default webpackConfig;
