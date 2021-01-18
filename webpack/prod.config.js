const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: [
   'bootstrap-loader', './src/index.jsx'
  ],

  output: {
    filename: 'bundle.js',
    publicPath: '/assets/static/',
  },

  module: {
    loaders: [],
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'jquery': 'jQuery',
    'leaflet': 'L',
    'moment': 'moment',
    'chart.js': 'Chart'
  },
  
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
      __DEVELOPMENT__: false,
    }),
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    })
  ],
};
