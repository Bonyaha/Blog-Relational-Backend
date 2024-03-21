const { Blog } = require('../models')
const { SECRET } = require('../util/config')

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
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		request.token = authorization.substring(7)
	}
	else {
		request.token = null
	}
	next()
}

const userExtractor = async (request, response, next) => {
	console.log('request.token is', request.token)
	if (!request.token) {
		return response.status(401).json({ error: 'token missing' })
	}

	const decodedToken = await jwt.verify(request.token, SECRET)

	if (!decodedToken.id) {
		console.log('no token object')
		return response.status(401).json({ error: 'token invalid' })
	}
	request.user = await User.findByPk(decodedToken.id)
	next()
}

module.exports = {
	blogFinder,
	errorHandler,
	tokenExtractor,
	userExtractor
}