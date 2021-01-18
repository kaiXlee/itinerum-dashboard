const path = require('path');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const webpack = require('webpack');
const merge = require('webpack-merge');

const development = require('./dev.config.js');
const production = require('./prod.config.js');

require('babel-polyfill').default;

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

const PATHS = {
  app: path.join(__dirname, '../src'),
  build: path.join(__dirname, '../static'),
};

const common = {
  entry: [PATHS.app],

  output: {
    path: PATHS.build,
  },

  resolve: {
    extensions: ['', '.jsx', '.js', '.json', '.scss'],
    modulesDirectories: ['node_modules', PATHS.app]
  },

  module: {
    loaders: [
    {
      test: /\.json$/,
      loader: 'json'
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9]?[0-9])?$/,
      loader: 'url',
      query: {
        limit: 50000,
        mimetype: 'application/font-woff',
        name: './fonts/[hash].[ext]'
      }
    },
    {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9]?[0-9])?$/,
      loader: 'file-loader',
      query: {
        limit: 50000,
        name: './fonts/[hash].[ext]'
      }
    },
    {
      test: /\.css$/,
      loader: 'style!css',
    },
    {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        cacheDirectory: true,
        presets: ['react', 'es2015', 'stage-0'],
        plugins: ['transform-decorators-legacy']
      }
    }, {
      test: /\.(gif|png|jpg)$/,
      loader: 'file-loader?name=images/[name].[ext]'
    },
    {
      test: /\.scss$/,
      loader: 'style!css?localIdentName=[path][name]--[local]!postcss-loader!sass',
    }
    ]
  },

  styles: {
    'core': true,
    'icons': true,
  },

  // fetch polyfill
  plugins: [
    new webpack.ProvidePlugin({
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
  ],

  postcss: (webpack) => {
    return [
      autoprefixer({
        browsers: ['last 2 versions'],
      }),
      postcssImport({
        addDependencyTo: webpack,
      }),
    ];
  }
};


if (TARGET === 'start') {
  console.log('Webpack development config loaded.');
  module.exports = merge(development, common);
}

if (TARGET === 'build' || !TARGET) {
  console.log('Webpack production config loaded.');
  module.exports = merge(production, common);
}
