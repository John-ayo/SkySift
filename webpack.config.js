const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: 'src/image', 
          to: 'image',
          noErrorOnMissing: true
        },
        { 
          from: 'src/*.png', 
          to: '[name][ext]',
          noErrorOnMissing: true
        },
        { 
          from: 'src/*.ico', 
          to: '[name][ext]',
          noErrorOnMissing: true
        },
        { 
          from: 'src/*.svg', 
          to: '[name][ext]',
          noErrorOnMissing: true
        },
        {
          from: 'src/firebase-messaging-sw.js',
          to: 'firebase-messaging-sw.js',
          noErrorOnMissing: true
        }
      ]
    }),
    new Dotenv({
      path: './.env',
      safe: true,
      systemvars: true,
      silent: true
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.js', '.json']
  }
};
