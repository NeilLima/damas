require('reflect-metadata');
const handler = require('../dist/main').default;

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

module.exports = handler;
