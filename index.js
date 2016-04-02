'use strict'

var Botkit = require('botkit')
var BeepBoop = require('beepboop-botkit')

var controller = Botkit.slackbot({
  debug: true
})

var beepboop = BeepBoop.start(controller, {
  debug: true
})

require('./lib/bot')(controller, beepboop)
