var chai = require('chai');

chai.config.truncateThreshold = 0;
chai.config.includeStack = true;
chai.use(require('chai-subset'));
chai.use(require('sinon-chai'));
chai.use(require('chai-enzyme')());
require('babel-polyfill');

// contextualRequire is a require statement configured to look in a specific
// directory ('./src'). The keys function on it returns a list of files globbed
// using the regex in the .context call.
var contextualRequire = require.context('./src', true, /\.test\.js$/);
// Loop through each globbed filename and call require with it.
contextualRequire.keys().forEach(contextualRequire);
