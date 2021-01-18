var fs = require('fs');

var babelrc = fs.readFileSync('./.babelrc');
var config;

console.log('Starting development server...');

try {
  config = JSON.parse(babelrc);
  console.log('Babel loaded');
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

require('babel-core/register')(config);
require('../server');
