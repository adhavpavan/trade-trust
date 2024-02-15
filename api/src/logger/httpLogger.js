const morgan = require('morgan')
const json = require('morgan-json')
const format = json({
  method: ':method',
  url: ':url',
  status: ':status',
  contentLength: ':res[content-length]',
  responseTime: ':response-time'
})

const logger = require('./')(module)
const httpLogger = morgan(format, {
  stream: {
    write: (message) => {
      const {
        method,
        url,
        status,
        contentLength,
        responseTime
      } = JSON.parse(message)

      logger.info({
        type: 'HTTP Access Log',
        timestamp: new Date().toString(),
        method,
        url,
        status: Number(status),
        contentLength,
        responseTime: Number(responseTime)
      })
    }
  }
})

module.exports = httpLogger
