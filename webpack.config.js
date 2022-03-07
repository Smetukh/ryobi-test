const path = require("path");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "threekit--ryobi--link-builder.js",
    chunkFilename: "[id].js",
    publicPath: "",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    disableHostCheck: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(sass|less|css)$/,
        use: [
          {
            loader: "style-loader",
            options: { injectType: "singletonStyleTag" },
          },
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          "url-loader?name=images/[name].[ext]",
          {
            loader: "webpack-image-resize-loader",
            options: {
              width: 300,
            },
          },
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|woff)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?name=fonts/[name].[ext]",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/public/index.html",
      filename: "index.html",
      inject: "body",
    }),
    new Dotenv()
  ],
};
