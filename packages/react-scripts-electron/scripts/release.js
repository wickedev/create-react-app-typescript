const {buildRelease} = require('@wickedev/react-electron-dev-utils');

let argv = process.argv.slice(2);

buildRelease(argv);