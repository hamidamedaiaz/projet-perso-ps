const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const api = require('./api')


module.exports = (cb) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(cors())
  app.use(bodyParser.json({}))
  app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'))
  app.use('/api', api)

  // Cyril : j'ai rajouté ça pour pouvoir upload les fichié
  app.use('/upload', express.static(path.join(__dirname, '../upload')))

  // app.use('*', (req, res) => res.status(404).end())


  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))


  const server = app.listen(process.env.PORT || 9428, () => cb && cb(server))
}
