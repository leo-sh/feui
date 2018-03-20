const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: {
    vendor: ["packages"],
    app: "./demos/main.js"
  },
  output: {
    path: path.join(__dirname, "../dist"),
    publicPath: "/",
    filename: "[name].js"
  },
  devServer: {
    host: "0.0.0.0",
    port: "7788",
    historyApiFallback: true,
    // open: true,
    stats: "errors-only"
  },
  resolve: {
    modules: [path.join(__dirname, "../node_modules"), "node_modules"],
    extensions: [" ", ".js", ".vue", ".css"],
    alias: {
      vue: "vue/dist/vue.min.js",
      packages: path.join(__dirname, "../packages"),
      lib: path.join(__dirname, "../lib")
    }
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              preserveWhitespace: false,
              extractCSS: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules|vue-router\/|vue-loader\//,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader", "postcss-loader"],
          publicPath: "./css/"
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10240,
          name: "images/[name].[hash:8].[ext]"
        }
      },
      {
        test: /\.md/,
        use: ["vue-loader", "fast-vue-md-loader"]
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: "url-loader"
      }
    ]
  },
  devtool: "source-map",
  plugins: [
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./demos/index.html",
      inject: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: 2,
      filename: isProduction ? "js/vendor.[hash:8].js" : "vendor.js"
    }),
    new ExtractTextPlugin({
      filename: isProduction ? "css/[name].[hash:8].css" : "[name].css",
      allChunks: true
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new FriendlyErrorsPlugin()
  ]
};
