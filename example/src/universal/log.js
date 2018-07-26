import moment from 'moment';

module.exports = class Logger {
  constructor(moduleName) {
    this.moduleName = moduleName;
  }

  consoleWriter = (level, ...args) => {
    const sanitisedModuleName = this.moduleName ? `[${this.moduleName}]` : '';
    console[level](`${moment().format()} ${level.toUpperCase()} ${sanitisedModuleName}`, ...args);
  };

  log = (...args) => {
    this.consoleWriter('log', ...args);
  };

  info = (...args) => {
    this.consoleWriter('info', ...args);
  };

  warn = (...args) => {
    this.consoleWriter('warn', ...args);
  };

  error = (...args) => {
    this.consoleWriter('error', ...args);
  }
};
