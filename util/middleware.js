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
	}

	next(error)
}

module.exports = {
	blogFinder,
	errorHandler
}