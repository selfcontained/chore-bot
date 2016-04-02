module.exports = {
  production: {
    logging: {
      colorize: false,
      timestamp: true,
      loggers: {
        debug: 'rainbow',
        botkitDebug: 'blue',
        botkit: 'blue',
        beepboop: 'cyan',
        info: 'green',
        error: 'red'
      },
      enabled: {
        debug: false,
        botkitDebug: false,
        botkit: true,
        beepboop: true,
        info: true,
        error: true
      }
    }
  },
  // Applied over production values
  development: {
    logging: {
      colorize: true,
      timestamp: true,
      enabled: {
        debug: true
      }
    }
  }
}
