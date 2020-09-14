const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const DashboardPlugin = require('webpack-dashboard/plugin')
const jsonImporter = require('node-sass-json-importer')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const flatten = require('flat')
const developmentConfig = require('../config/development.json')
const devConfig = require('../config/dev.json')
const prodConfig = require('../config/production.json')
const stagingConfig = require('../config/staging.json')
const qaConfig = require('../config/qa.json')
const baseConfig = require('../config/common.json')
exports.devServer = ({
  host,
  port
} = {}) => ({
  devServer: {
    hot: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    historyApiFallback: true,
    disableHostCheck: true,
    // contentBase: './', stats: 'errors-only',
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    overlay: {
      errors: true,
      warnings: true
    }
  },
  plugins: [new webpack.NamedModulesPlugin()]
})
exports.lintJavaScript = ({
  include,
  exclude,
  options
}) => ({
  module: {
    rules: [{
      test: /\.js$/,
      include,
      exclude,
      enforce: 'pre',
      loader: 'eslint-loader',
      options
    }]
  }
})
exports.loadCSS = ({
  include,
  exclude
} = {}) => ({
  module: {
    rules: [{
      test: /\.scss$/,
      include,
      exclude,
      use: [
        'style-loader', {
          loader: 'css-loader',
          options: {
            importLoaders: 2
          }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: () => ([require('autoprefixer')()])
          }
        }, {
          loader: 'sass-loader',
          // Apply the JSON importer via sass-loader's options.
          options: {
            importer: jsonImporter
          }
        }
        // {   loader: 'sass-resources-loader',   options: {     // Provide path to the
        // file with resources resources:     // './path/to/resources.scss', Or array
        // of paths     resources: [       path.resolve(__dirname,
        // '../app/assets/styles/variables/*.scss'),       path.resolve(__dirname,
        // '../app/assets/styles/mixins/_functions.scss')     ]   } },

      ]
    }]
  }
})
exports.extractCSS = ({
  include,
  exclude,
  use
} = {}) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    filename: '[name].[contenthash:8].css'
  })
  return {
    module: {
      rules: [{
        test: /\.scss$/,
        include,
        exclude,
        use: plugin.extract({
          // use, fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                importLoaders: 3
              }
            }, {
              loader: 'postcss-loader',
              options: {
                plugins: () => ([require('autoprefixer')()])
              }
            }, {
              loader: 'sass-loader',
              // Apply the JSON importer via sass-loader's options.
              options: {
                importer: jsonImporter
              }
            }
            // , {
            //   loader: 'sass-resources-loader',
            //   options: { // Provide path to the
            //     // file with resources resources: // './path/to/resources.scss', Or array ofpaths
            //     resources: [
            //       // path.resolve(__dirname, '../app/assets/styles/variables/*.scss'),
            //       // path.resolve(__dirname, '../app/assets/styles/mixins/_functions.scss')
            //     ]
            //   }
            // }
          ],
          fallback: 'style-loader'
        })
      }]
    },
    plugins: [plugin]
  }
}
exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => ([require('autoprefixer')()])
  }
})
exports.purifyCSS = ({
  paths
}) => ({
  plugins: [new PurifyCSSPlugin({
    paths
  })]
})
exports.lintCSS = ({
  include,
  exclude
}) => ({
  module: {
    rules: [{
      test: /\.css$/,
      include,
      exclude,
      enforce: 'pre',
      loader: 'postcss-loader',
      options: {
        plugins: () => ([require('stylelint')()])
      }
    }]
  }
})
exports.loadImages = ({
  include,
  exclude,
  options
} = {}) => ({
  module: {
    rules: [{
      test: /\.(png|jpg|svg)$/,
      include,
      exclude,
      use: {
        loader: 'url-loader',
        options
      }
    }]
  }
})
exports.loadFonts = ({
  include,
  exclude,
  options
} = {}) => ({
  module: {
    rules: [{
      // Capture eot, ttf, woff, and woff2
      test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      include,
      exclude,
      use: {
        loader: 'file-loader',
        options
      }
    }]
  }
})
exports.loadJavaScript = ({
  include,
  exclude
}) => ({
  module: {
    rules: [{
      test: /\.js$/,
      include,
      exclude,
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [
          [
            'es2015', {
              modules: false
            }
          ],
          'stage-0',
          'react'
        ],
        plugins: ['lodash'],
        // Enable caching for improved performance during development. It uses default
        // OS directory by default. If you need something more custom, pass a path to
        // it. I.e., { cacheDirectory: '<path>' }
        cacheDirectory: true
      }
    }]
  },
  plugins: [
    new LodashModuleReplacementPlugin({
      currying: true,
      flattening: true,
    }),
  ]
})
exports.generateSourceMaps = ({
  type
}) => ({
  devtool: type
})
exports.extractBundles = (bundles) => ({
  plugins: bundles.map((bundle) => (new webpack.optimize.CommonsChunkPlugin(bundle)))
})
exports.clean = (path) => ({
  plugins: [new CleanWebpackPlugin([path], {
    root: '/'
  })]
})
exports.attachRevision = () => ({
  plugins: [new webpack.BannerPlugin({
    banner: new GitRevisionPlugin().version()
  })]
})
exports.minifyJavaScript = () => ({
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack
    .optimize
    .UglifyJsPlugin()
  ]
})
exports.minifyCSS = ({
  options
}) => ({
  plugins: [new OptimizeCSSAssetsPlugin({
    cssProcessor: cssnano,
    cssProcessorOptions: options,
    canPrint: false
  })]
})
exports.setFreeVariable = (key, value) => {
  const env = {}
  env[key] = JSON.stringify(value)
  return {
    plugins: [new webpack.DefinePlugin(env)]
  }
}
exports.page = ({
  path = '',
  template = require.resolve('html-webpack-plugin/default_index.ejs'),
  title,
  entry,
  output,
  chunks,
  isProd,
  isStaging,
  isQA,
  source
} = {}) => {
  const config = flatten(Object.assign(baseConfig, isProd ?
    prodConfig :
    isStaging ?
    stagingConfig :
    isQA ?
    qaConfig :
    devConfig))
  return {
    entry,
    output,
    plugins: [new HtmlWebpackPlugin({
      chunks,
      filename: `index.html`,
      template,
      title,
      config: config,
      hash: true
    })]
  }
}
exports.bundleAnalyzer = () => ({
  plugins: [new BundleAnalyzerPlugin({
    analyzerMode: 'static'
  })]
})
exports.Dashboard = () => ({
  plugins: [new DashboardPlugin()]
})
exports.CopyFavicon = (source, buildName) => ({
  plugins: [new CopyWebpackPlugin([{
    from: path.resolve(__dirname, '../app/assets/images'),
    to: path.resolve(__dirname, `../build/${source}-${buildName}/images`)
  }, {
    from: path.resolve(__dirname, '../app/assets/fonts'),
    to: path.resolve(__dirname, `../build/${source}-${buildName}/fonts`)
  }])]
})
exports.HMR = () => ({
  plugins: [new webpack.HotModuleReplacementPlugin()]
})
exports.loadConstants = (isProd, isStaging, isQA, isDev, source) => {
  let config = flatten(Object.assign(baseConfig, isProd ?
    prodConfig :
    isStaging ?
    stagingConfig :
    isQA ?
    qaConfig :
    isDev ?
    devConfig :
    developmentConfig))
  let constants = {}
  config.source = source
  Object
    .keys(config)
    .map((value) => {
      constants[value] = JSON.stringify(config[value])
    })
  return {
    plugins: [new webpack.DefinePlugin(constants)]
  }
}
