const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const fs = require('fs');
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
    filename: 'js/bundle.min.js',
  },
  devtool: false,
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
        use:  [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              outputPath: '../src/',
            },
          },
        ],
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
              url: false,
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: '$font-path: "../fonts/";',
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
      filename: 'css/bundle.min.css',
    }),
    new SpriteLoaderPlugin({
      plainSprite: true,
      spriteAttrs: {
        style: 'position: absolute; width: 0; height: 0',
      }
    }),
    ...pages.map(page => new HtmlWebpackPlugin({
      template: `${PATHS.PAGES}/${page}`,
      filename: `${page.replace(/\.pug/, '.html')}`,
      inject: true,
      minify: false,
      templateParameters: {
        env: 'production',
      },
    })),
    new CleanWebpackPlugin(),
  ],
};

module.exports = config;
