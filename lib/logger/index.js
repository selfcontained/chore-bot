var winston = require('winston')
var leveler = require('log-leveler')

var Logger = module.exports = function (config) {
  var leveled = leveler(config.enabled)

  var log = new (winston.Logger)({
    levels: leveled.levels,
    colors: config.loggers,
    transports: [
      new (winston.transports.Console)({
        level: leveled.level,
        colorize: config.colorize,
        timestamp: config.timestamp
      })
    ]
  })

  // dump sample log to log what's on
  Object.keys(config.loggers).forEach(function (logger) {
    log[logger]('logger enabled')
  })

  return log
}

// Re-route beepboop log messages
Logger.beepboopLogger = function (log) {
  return {
    debug: log.beepboop.bind(log),
    error: log.error.bind(log)
  }
}

// Re-route botkit log messages
Logger.botkitLogger = function (log) {
  return {
    log: function (lvl) {
      var args = Array.prototype.slice.call(arguments, 1)
      // isolate botkit debug messages - chatty
      if (lvl === 'debug') {
        return log.botkitDebug.apply(log, args)
      }

      log.botkit.apply(log, args)
    }
  }
}
