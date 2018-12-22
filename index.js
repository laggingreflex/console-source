const Path = require('path');
const util = require('util');
const consoleInterceptor = require('console-interceptor');

const cwd = process.cwd();
const paddingFiller = '…'

class CSError extends Error { get name() { return 'ConsoleSourceError' } };

const isEnabled = false
  || 'CONSOLE_SOURCE' in process.env
  || 'CONSOLE_SOURCE_SILENT' in process.env
  || (process.env.ENV || '').toUpperCase() === 'CONSOLE_SOURCE'
  || (process.env.ENV || '').toUpperCase() === 'CONSOLE_SOURCE_SILENT';
const isSilent = false
  || (process.env.CONSOLE_SOURCE || '').toUpperCase() === 'SILENT'
  || 'CONSOLE_SOURCE_SILENT' in process.env
  || (process.env.ENV || '').toUpperCase() === 'CONSOLE_SOURCE_SILENT';

let line = false
  || process.env.CONSOLE_SOURCE_LINE
  || 4;

const getFilename = () => {
  const stack = new Error('Dummy error used to find out file location')
    .stack
    .split(/[\n]/g)
    .map(s => s.trim())
    .filter(s => s.startsWith('at'))
    .filter(s => s.endsWith(')'))
    .map(s => (s.match(/\((.*?):([0-9]+:[0-9]+)\)$/) || []).slice(1))
    .filter(Boolean)
    .filter(a => a[0])
    .map(s => Path.relative(cwd, s[0] || '') + `:${s[1] || ''}`)
  return stack[line];
};

const modifyConsoleMessage = (input) => {
  let output = util.formatWithOptions({}, ...input);
  if (!output) return output;
  // return filename() + '\n' + output;
  const filename = getFilename();
  if (!filename) return output;
  const paddingLength = process.stdout.columns - filename.length - 2;
  let padding = '';
  if (output.length > paddingLength) {
    padding = '\n' + paddingFiller + Array(paddingLength).fill(paddingFiller).join('');
  } else {
    padding = ' ' + Array(paddingLength - output.length).fill(paddingFiller).join('');
  }
  return output + padding + ' ' + filename;
  if (output.length < paddingLength) {}
  return output + '\n' + Array(process.stdout.columns - filename.length).fill('.').join('') + filename;
};


let disable = () => {};
if (isEnabled) {
  disable = consoleInterceptor((m, msg) => {
    if (global.consoleSource === false || global.consoleSource && global.consoleSource.disable) {
      disable();
      return;
    }
    return modifyConsoleMessage(msg);
  }, (error, { console, disable, log, logError }) => {
    disable();
    logError();
    console.warn(`Note: console-source disabled. This node process's global 'console' which was patched by 'console-source' has now been reverted back`);
    log();
  });
  if (!isSilent) {
    console.warn(`Note: console-source enabled. This node process's global 'console' is patched by 'console-source'`);
  }
}

exports.disable = disable;

/** @param {number} number Adjust this number if it's not logging the correct source */
exports.line = (number) => line = number;
