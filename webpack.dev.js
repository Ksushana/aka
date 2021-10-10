const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs')
const path = require('path');

const PATHS = {
  SRC: path.resolve(__dirname, 'src'),
  PAGES: path.resolve(__dirname, 'src/pug/pages'),
  BUILD: path.resolve(__dirname, 'build'),
};

const pages = fs
  .readdirSync(PATHS.PAGES)
  .filter(fileName => fileName.endsWith('.pug'));

const config = {
  entry: [`${PATHS.SRC}/js/index.js`, `${PATHS.SRC}/styles/app.scss`],
  output: {
    path: PATHS.BUILD,
    filename: 'js/bundle.[fullhash].js',
  },
  devServer: {
    contentBase: PATHS.BUILD,
    compress: true,
    port: 8080,
    open: true,
  },
  target: 'web',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'svg-sprite-loader',
        },
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              pretty: true,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: '$font-path: "../../fonts/";',
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${PATHS.SRC}/fonts`,
          to: `${PATHS.BUILD}/fonts`,
        },
        {
          from: `${PATHS.SRC}/images`,
          to: `${PATHS.BUILD}/images`,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/bundle.[fullhash].css',
    }),
    ...pages.map(page => new HtmlWebpackPlugin({
      template: `${PATHS.PAGES}/${page}`,
      filename: `./${page.replace(/\.pug/, '.html')}`,
      inject: true,
      templateParameters: {
        env: 'development',
      },
    })),
  ],
};

module.exports = config;
