global.sinon = require('sinon');
global.Promise = require('promise');
global.chai = require('chai');
global.withData = require('leche').withData;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();
