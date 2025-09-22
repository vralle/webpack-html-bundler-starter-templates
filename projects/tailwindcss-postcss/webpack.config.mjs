/**
 * Webpack configuration
 */

import { Buffer } from "node:buffer";
import { join, parse, relative } from "node:path";
import { env } from "node:process";
import sharp from "sharp";

// Plugins
import HtmlBundlerPlugin from "html-bundler-webpack-plugin";
import HtmlMinimizerPlugin from "html-minimizer-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import { SwcMinifyWebpackPlugin } from "swc-minify-webpack-plugin";

/** Tools */
import browserslist from "browserslist";
import svgToMiniDataURI from "mini-svg-data-uri";

// Configurations
import { sharpEncodeOptions, svgoConfig, swcHtmlConfig } from "@vralle/tool-configs";
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
const isProduction = env["NODE_ENV"] === "production";
const isStaging = env["NODE_ENV"] === "staging";
const isDevelopment = env["NODE_ENV"] === "development";
const imgRegExp = /\.(?:avif|gif|heif|ico|jp[2x]|j2[kc]|jpe?g|jpe|jxl|png|raw|svg|tiff?|webp)/i;
const fontRegExp = /\.(?:ttf|woff2?)/i;

// Leave browserslist args empty to load .browserslistrc or set options directly
const browsersData = browserslist();

/**
 * @type {WebpackConfig & DevServerConfig}
 */
const webpackConfig = {
  mode: isProduction || isStaging ? "production" : "development",
  output: {
    publicPath: isProduction ? "https://example.site/" : isDevelopment ? "/" : "auto",
    path: projectOutputPath,
    clean: true,
    crossOriginLoading: "anonymous",
    hashDigestLength: 9,
    filename: join(outputJsDir, "[name].[contenthash].js"),
    chunkFilename: join(outputJsDir, isProduction || isStaging ? "[id].[contenthash].js" : "[name].[contenthash].js"),
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

      if (isProduction || isStaging) {
        if (fontRegExp.test(pathParts.ext)) {
          return join(projectPaths.outputAssetDir, dirPart, "[contenthash][ext]");
        }
      }

      const namePart = pathParts.name.toLowerCase();

      if (fontRegExp.test(pathParts.ext)) {
        return join(projectPaths.outputAssetDir, dirPart, `${namePart}.[contenthash][ext]`);
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
          loader: "swc-loader",
          /** @see https://swc.rs/docs/usage/swc-loader */
          options: {
            env: {
              targets: browsersData,
            },
          },
        },
      },
      {
        test: /\.css/i,
        use: [
          {
            loader: "css-loader",
            /** @see https://github.com/webpack-contrib/css-loader */
            options: {
              sourceMap: !isProduction,
              importLoaders: 0,
            },
          },
          {
            loader: "postcss-loader",
            /** @see https://github.com/webpack-contrib/postcss-loader */
            options: {
              sourceMap: !isProduction,
              postcssOptions: {
                plugins: {
                  "@tailwindcss/postcss": {},
                },
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
           * Conditions for importing assets as data URI
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
        test: /\.css/i,
        // Global output.cssFilename and output.hashDigestLength don't work for css. Tested with HtmlBundlerPlugin 4.18
        filename: join(outputCssDir, "[name].[contenthash:9].css"),
      },
      preload: [
        {
          test: /app\.m?js/i,
          as: "script",
        },
      ],
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
      minify: false,
      verbose: env["NODE_ENV"] === "test" ? false : "auto",
    }),
  ],
  optimization: {
    minimizer: [
      new HtmlMinimizerPlugin({
        minify: HtmlMinimizerPlugin.swcMinify,
        minimizerOptions: swcHtmlConfig,
      }),
      new SwcMinifyWebpackPlugin(),
      new ImageMinimizerPlugin({
        test: imgRegExp,
        include: join(projectSrcPath, "img"),
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
  devtool: isProduction ? false : "source-map",
  devServer: {
    static: false,
    hot: false,
    liveReload: true,
    watchFiles: {
      paths: "src/**/*",
      options: {
        cwd: projectPaths.root,
        usePolling: false,
        alwaysStat: false,
        ignorePermissionErrors: false,
        ignoreInitial: true,
        interval: 750,
        binaryInterval: 1000,
        atomic: 500,
      },
    },
  },
  watchOptions: {
    poll: true,
    ignored: ["**/.git", "**/node_modules", "**/dist"],
  },
};

export default webpackConfig;
