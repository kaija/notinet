var debug = require('winston');
var customColorLevel = {
  levels: {
    debug:  0,
    info:   1,
    warn:   2,
    error:  3,
    fetal:  4
  },
  colors: {
    debug:  'green',
    info:   'cyan',
    warn:   'yellow',
    error:  'magenta',
    fetal:  'red'
  }
}
//Set debug level
debug.setLevels(customColorLevel.levels);
//Add log level color
debug.addColors(customColorLevel.colors);
debug.remove(debug.transports.Console);
debug.add(debug.transports.Console, { level: 'debug', colorize:true });

module.exports = debug;
