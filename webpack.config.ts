import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CompressionPlugin  from 'compression-webpack-plugin'
import BrotliPlugin from 'brotli-webpack-plugin'
import Dotenv from 'dotenv-webpack'

module.exports = (env: any, args: any) => {
  const isProduction = args.mode === "production";
  return {
    entry: "./src/index.tsx",
    devtool: isProduction ? "inline-source-map" : "source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    devServer: {
      contentBase: path.resolve(__dirname, "./dist"),
      hot: true,
      port: 9000
    },
    plugins: [
      new Dotenv(),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new CompressionPlugin(),
      new BrotliPlugin({
        asset: "[path].br[query]",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.7,
      }),
    ],
  };
};
