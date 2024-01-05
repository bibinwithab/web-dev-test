const { logEvents } = require('./logger')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${err.method}\t${req.url}\t${req.headers.url}`, 'errorLog.log')
    console.log(err.stack)

    const status = res.statusCode? res.statusCode : 500;
    res.status(status)
    res.json({error: err.message})
}

module.exports = { errorHandler }