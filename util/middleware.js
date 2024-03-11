const blogFinder = async (req, res, next) => {
	try {
		req.blog = await Blog.findByPk(req.params.id)
		if (!req.blog) {
			return res.status(404).end()
		}
		next()
	} catch (error) {
		next(error)
	}
}

const errorHandler = (error, req, res, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	}

	res.status(500).json({ error: 'Internal Server Error' })
}

module.exports = {
	blogFinder,
	errorHandler
}