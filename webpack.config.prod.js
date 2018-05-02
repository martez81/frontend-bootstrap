'use strict'

const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const glob = require('glob')

const entry = glob
  .sync('./src/**/*.js')
  .reduce(
    (entries, entry) =>
      Object.assign(entries, { [path.parse(entry).name]: entry })
    , { index: './src/index.js' }
  )

module.exports = {
  entry,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  },
  target: 'web',
  mode: 'production',
  resolve: {
    extensions: ['.js'],
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.pug$/,
        exclude: /node_modules/,
        use: {
          loader: 'pug-lint-loader',
          options: require('./.pug-lintrc.json')
        }
      },
      {
        test: /\.pug$/,
        use: [
          'file-loader?name=[name].html',
          'extract-loader',
          'html-loader',
          'pug-html-loader'
        ]
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            cache: true,
            emitError: true,
            emitWarning: true
          }
        }
      },
      {
        test: /\.js$/,
        exclude: ['node_modules'],
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie <9'
                    ],
                    flexbox: 'no-2009'
                  })
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.resolve(__dirname,'/src/scss')]
              }
            }
          ]
        })
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie <9'
                  ],
                  flexbox: 'no-2009'
                })
              ]
            }
          },
        ]
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
           'file-loader?name=assets/[name].[ext]',
          'image-webpack-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new ExtractTextPlugin('styles.[hash:8].css')
  ]
}
