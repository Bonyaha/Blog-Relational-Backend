const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')

const blogFinder = async (req, res, next) => {
	req.blog = await Blog.findByPk(req.params.id)
	if (!req.blog) {
		return res.status(404).end()
	}
	next()

}

const errorHandler = (error, req, res, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	} else if (error.name === 'SequelizeValidationError') {
		const validationErrors = error.errors.map(err => err.message)
		return res.status(400).json({ error: validationErrors })
	}

	next(error)
}
const tokenExtractor = (req, res, next) => {
	const authorization = req.get('authorization')
	console.log(authorization)
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		req.token = authorization.substring(7)
	}
	else {
		req.token = null
	}
	next()
}

const userExtractor = async (req, res, next) => {
	console.log('request.token is', req.token)
	if (!req.token) {
		return response.status(401).json({ error: 'token missing' })
	}

	const decodedToken = await jwt.verify(req.token, SECRET)

	if (!decodedToken.id) {
		console.log('no token object')
		return res.status(401).json({ error: 'token invalid' })
	}
	req.user = await User.findByPk(decodedToken.id)
	next()
}

module.exports = {
	blogFinder,
	errorHandler,
	tokenExtractor,
	userExtractor
}