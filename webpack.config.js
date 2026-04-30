const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

// "auto" + WEBPACK_DEV_SERVER_BASE_PORT (see npm scripts) picks first free port from that base (e.g. 3000, 3001, …).
let devServerPort = "auto";
if (process.env.PORT != null && String(process.env.PORT).trim() !== "") {
  const p = parseInt(process.env.PORT, 10);
  if (Number.isFinite(p) && p > 0) devServerPort = p;
}

module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    publicPath: "/",
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify({
        // In production (NODE_ENV=production), use relative URL "/api" so requests go to the same domain
        // In development, use localhost:5001
        REACT_APP_API_URL:
          process.env.NODE_ENV === "production"
            ? "/api"
            : process.env.REACT_APP_API_URL || "http://localhost:5001/api",
        NODE_ENV: process.env.NODE_ENV || "development",
      }),
    }),
  ],
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  performance: {
    hints: false,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: devServerPort,
    hot: true,
    historyApiFallback: true,
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    ],
  },
};
