var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  eslint: {
    configFile: './.eslintrc',
  },
  //devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("style.css", {
      allChunks: true
    }),
    new webpack.DefinePlugin({
      $$PRODUCTION: JSON.stringify(false),
      $$DEBUG: JSON.stringify(true),
    })/*,
     new webpack.optimize.UglifyJsPlugin({
     compress: {
     warnings:  false
     }
     })*/
  ],
  module: {
     preLoaders: [
       {test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/},
     ],
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname
      },

      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      }
    ]
  }
  , resolve: {
    modulesDirectories: ['node_modules', 'src']
  }
};
