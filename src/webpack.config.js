const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const glob = require('glob')
const devConstants = require('./config/development.json')
const parts = require('./webpack/webpack.parts')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: {
    web: path.join(__dirname, 'build', 'web'),
    mobile: path.join(__dirname, 'build', 'mobile')
  }
}
const commonConfig = (source, target, env) => {
  return merge([{
      output: {
        filename: '[name]-[hash:8].js',
        chunkFilename: '[name]-[chunkhash:5].js',
        // path: PATHS.build[target]
        path: target === 'web' ?
          path.join(__dirname, 'build', `${source}-web`) : path.join(__dirname, 'build', `${source}-mobile`)
      }
    },
    // parts.lintJavaScript({ include: PATHS.app }),
    parts.loadConstants(env.production, env.staging, env.qa, env.dev, source),
    parts.lintCSS({
      include: PATHS.app
    }),
    parts.loadJavaScript({
      include: PATHS.app,
      exlude: /__tests__\/\.js$/
    }),
    parts.CopyFavicon(source, env.PLATFORM)
  ])
}
const productionConfig = (source, target, env) => {
  config = require('./config/production.json');
  config.source = source
  return merge([{
      externals: {
        'Config': JSON.stringify(config)
      },
      performance: {
        hints: 'warning', // 'error' or false are valid too
        maxEntrypointSize: 200000, // in bytes
        maxAssetSize: 450000 // in bytes
      },
      output: {
        chunkFilename: '[name].[chunkhash:8].js',
        filename: '[name].[chunkhash:8].js'
      },
      plugins: [new webpack.HashedModuleIdsPlugin()],
      recordsPath: path.join(__dirname, 'records.json')
    },
    parts.clean(target === 'web' ?
      path.join(__dirname, 'build', `${source}-web`) :
      path.join(__dirname, 'build', `${source}-mobile`)),
    parts.loadFonts({
      options: {
        name: '/fonts/[name].[hash:8].[ext]'
      }
    }),
    parts.minifyJavaScript(),
    parts.extractCSS(),
    parts.minifyCSS({
      options: {
        discardComments: {
          removeAll: true,
          // Run cssnano in safe mode to avoid potentially unsafe transformations.
          safe: true
        }
      }
    }),
    parts.extractBundles([{
      name: 'vendor',
      minChunks: ({
        resource
      }) => (resource && resource.indexOf('node_modules') >= 0 && resource.match(/\.js$/))
    }, {
      name: 'manifest',
      minChunks: Infinity
    }]),
    parts.attachRevision(),
    // parts.generateSourceMaps({type: 'source-map'}), parts.purifyCSS({   paths:
    // glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }), }),
    parts.loadImages({
      options: {
        limit: 1500,
        name: '/images/[name].[hash:8].[ext]'
      }
    }),
    parts.setFreeVariable('process.env.NODE_ENV', 'production'),
    parts.bundleAnalyzer()
  ])
}
const stagingConfig = (source, target, env) => {
  config = require('./config/staging.json');
  config.source = source
  return merge([{
      externals: {
        'Config': JSON.stringify(config)
      },
      performance: {
        hints: 'warning', // 'error' or false are valid too
        maxEntrypointSize: 200000, // in bytes
        maxAssetSize: 450000 // in bytes
      },
      output: {
        chunkFilename: '[name].[chunkhash:8].js',
        filename: '[name].[chunkhash:8].js'
      },
      plugins: [new webpack.HashedModuleIdsPlugin()],
      recordsPath: path.join(__dirname, 'records.json')
    },
    parts.clean(target === 'web' ?
      path.join(__dirname, 'build', `${source}-web`) :
      path.join(__dirname, 'build', `${source}-mobile`)),
    parts.loadFonts({
      options: {
        name: '/fonts/[name].[hash:8].[ext]'
      }
    }),
    parts.minifyJavaScript(),
    parts.extractCSS(),
    parts.minifyCSS({
      options: {
        discardComments: {
          removeAll: true,
          // Run cssnano in safe mode to avoid potentially unsafe transformations.
          safe: true
        }
      }
    }),
    parts.extractBundles([{
      name: 'vendor',
      minChunks: ({
        resource
      }) => (resource && resource.indexOf('node_modules') >= 0 && resource.match(/\.js$/))
    }, {
      name: 'manifest',
      minChunks: Infinity
    }]),
    parts.attachRevision(),
    // parts.generateSourceMaps({type: 'source-map'}), parts.purifyCSS({   paths:
    // glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }), }),
    parts.loadImages({
      options: {
        limit: 1500,
        name: '/images/[name].[hash:8].[ext]'
      }
    }),
    parts.setFreeVariable('process.env.NODE_ENV', 'staging'),
    parts.bundleAnalyzer()
  ])
}

const devConfig = (source, target, env) => {
  config = require('./config/dev.json');
  config.source = source
  return merge([{
      externals: {
        'Config': JSON.stringify(config)
      },
      performance: {
        hints: 'warning', // 'error' or false are valid too
        maxEntrypointSize: 200000, // in bytes
        maxAssetSize: 450000 // in bytes
      },
      output: {
        chunkFilename: '[name].[chunkhash:8].js',
        filename: '[name].[chunkhash:8].js'
      },
      plugins: [new webpack.HashedModuleIdsPlugin()],
      recordsPath: path.join(__dirname, 'records.json')
    },
    parts.clean(target === 'web' ?
      path.join(__dirname, 'build', `${source}-web`) :
      path.join(__dirname, 'build', `${source}-mobile`)),
    parts.loadFonts({
      options: {
        name: '/fonts/[name].[hash:8].[ext]'
      }
    }),
    parts.minifyJavaScript(),
    parts.extractCSS(),
    parts.minifyCSS({
      options: {
        discardComments: {
          removeAll: true,
          // Run cssnano in safe mode to avoid potentially unsafe transformations.
          safe: true
        }
      }
    }),
    parts.extractBundles([{
      name: 'vendor',
      minChunks: ({
        resource
      }) => (resource && resource.indexOf('node_modules') >= 0 && resource.match(/\.js$/))
    }, {
      name: 'manifest',
      minChunks: Infinity
    }]),
    parts.attachRevision(),
    // parts.generateSourceMaps({type: 'source-map'}), parts.purifyCSS({   paths:
    // glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }), }),
    parts.loadImages({
      options: {
        limit: 1500,
        name: '/images/[name].[hash:8].[ext]'
      }
    }),
    parts.setFreeVariable('process.env.NODE_ENV', 'dev'),
    parts.bundleAnalyzer()
  ])
}

const qaConfig = (source, target, env) => {

  config = require('./config/qa.json');
  config.source = source
  return merge([{
      externals: {
        'Config': JSON.stringify(config)
      },
      performance: {
        hints: 'warning', // 'error' or false are valid too
        maxEntrypointSize: 200000, // in bytes
        maxAssetSize: 450000 // in bytes
      },
      output: {
        chunkFilename: '[name].[chunkhash:8].js',
        filename: '[name].[chunkhash:8].js'
      },
      plugins: [new webpack.HashedModuleIdsPlugin()],
      recordsPath: path.join(__dirname, 'records.json')
    },
    parts.clean(target === 'web' ?
      path.join(__dirname, 'build', `${source}-web`) :
      path.join(__dirname, 'build', `${source}-mobile`)),
    parts.loadFonts({
      options: {
        name: '/fonts/[name].[hash:8].[ext]'
      }
    }),
    parts.minifyJavaScript(),
    parts.extractCSS(),
    parts.minifyCSS({
      options: {
        discardComments: {
          removeAll: true,
          // Run cssnano in safe mode to avoid potentially unsafe transformations.
          safe: true
        }
      }
    }),
    parts.extractBundles([{
      name: 'vendor',
      minChunks: ({
        resource
      }) => (resource && resource.indexOf('node_modules') >= 0 && resource.match(/\.js$/))
    }, {
      name: 'manifest',
      minChunks: Infinity
    }]),
    parts.attachRevision(),
    // parts.generateSourceMaps({type: 'source-map'}), parts.purifyCSS({   paths:
    // glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }), }),
    parts.loadImages({
      options: {
        limit: 1500,
        name: '/images/[name].[hash:8].[ext]'
      }
    }),
    parts.setFreeVariable('process.env.NODE_ENV', 'qa'),
    parts.bundleAnalyzer()
  ])
}
const developmentConfig = (source, target, env) => {

  config = require('./config/development.json')
  config.source = source

  return merge([{
      externals: {
        'Config': JSON.stringify(config)
      },
      output: {
        devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
      }
    },
    parts.HMR(),
    parts.extractBundles([{
      name: 'vendor',
      minChunks: ({
        resource
      }) => (resource && resource.indexOf('node_modules') >= 0 && resource.match(/\.js$/))
    }, {
      name: 'manifest',
      minChunks: Infinity
    }]),
    parts.generateSourceMaps({
      type: 'cheap-module-source-map'
    }),
    parts.devServer({
      // Customize host/port here if needed
      host: devConstants[target].host || process.env.HOST,
      port: devConstants[target][source]
    }),
    parts.loadCSS(),
    parts.loadImages(),
    parts.loadFonts({
      options: {
        name: '[name].[ext]',
        publicPath: './',
        outputPath: 'fonts/'
      }
    }),
    parts.Dashboard()
    // <parts className="bundleAnalyzer"></parts>
  ])
}
const pages = (source, target, env) => {
  const isProd = env.production || false
  const isStaging = env.staging || false
  const isQA = env.qa || false
  const platforms = {
    web: parts.page({
      title: 'Propeluss',
      path: 'web',
      template: path.join(PATHS.app, 'src', `${source}`, 'index.web.ejs'),
      entry: {
        web: ['babel-polyfill', path.join(PATHS.app, `src/${source}/index.web.js`)]
      },
      chunks: [
        'web', 'manifest', 'vendor'
      ],
      isProd,
      isStaging,
      isQA,
      source
    }),
    mobile: parts.page({
      title: 'Propeluss',
      template: path.join(PATHS.app, 'src', `${source}`, 'index.mobile.ejs'),
      path: 'mobile',
      entry: {
        mobile: path.join(PATHS.app, `src/${source}/index.mobile.js`)
      },
      chunks: [
        'mobile', 'manifest', 'vendor'
      ],
      isProd,
      isStaging,
      isQA
    })
  }
  return platforms[target]
}
module.exports = (env = {}) => {
  const SOURCE = env.SOURCE
  const TARGETS = env.PLATFORM ?
    [env.PLATFORM] :
    ['mobile', 'web']
  return TARGETS.map((target) => {
    const base = commonConfig(SOURCE, target, env)
    const config = env.production === true ?
      productionConfig(SOURCE, target, env) :
      env.staging === true ?
      stagingConfig(SOURCE, target, env) :
      env.qa === true ?
      qaConfig(SOURCE, target, env) :
      env.dev === true ?
      devConfig(SOURCE, target, env) :
      developmentConfig(SOURCE, target, env)

    return merge(base, config, pages(SOURCE, target, env))
  })
}
