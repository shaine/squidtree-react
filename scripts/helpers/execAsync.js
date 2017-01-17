const execAsync = require('child_process').exec;

const exec = (command, cb) => execAsync(command, { stdio: 'inherit' }, cb);

export default exec;
