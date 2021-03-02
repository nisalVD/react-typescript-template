import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import BrotliPlugin from "brotli-webpack-plugin";
import Dotenv from "dotenv-webpack";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { HotModuleReplacementPlugin } from "webpack";

type Env = {
  production: boolean;
};

type Args = {
  mode: string;
  env: Env;
};

module.exports = (env: Env, args: Args) => {
  const isProduction = args.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/index.tsx",
    devtool: isProduction ? false : "eval-source-map",
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve("babel-loader"),
            options: {
              plugins: [!isProduction && require.resolve("react-refresh/babel")].filter(Boolean),
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    devServer: {
      contentBase: path.resolve(__dirname, "./dist"),
      hot: true,
      port: 9000,
    },
    plugins: [
      new Dotenv(),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      !isProduction && new HotModuleReplacementPlugin(),
      !isProduction && new ReactRefreshWebpackPlugin(),
      isProduction && new CompressionPlugin(),
      isProduction && new ReactRefreshWebpackPlugin(),
      new CompressionPlugin(),
      new BrotliPlugin({
        asset: "[path].br[query]",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.7,
      }),
    ].filter(Boolean),
  };
};
