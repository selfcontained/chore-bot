'use strict'

var Botkit = require('botkit')
var BeepBoop = require('beepboop-botkit')
var Logger = require('./lib/logger/')
var config = require('./config/')()
var log = Logger(config.logging)

log.debug('Config: ', config)

var controller = Botkit.slackbot({
  debug: config.debugBotkit,
  logger: Logger.botkitLogger(log)
})

var beepboop = BeepBoop.start(controller, {
  debug: config.debugBeepBoop,
  logger: Logger.beepboopLogger(log)
})

require('./lib/bot')(controller, beepboop, log, config)
