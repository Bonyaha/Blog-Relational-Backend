// In controllers/authors.js

const express = require('express')
const router = express.Router()
const { sequelize } = require('../util/db')
const { Blog } = require('../models')

router.get('/', async (req, res) => {
	const authorsData = await Blog.findAll({
		attributes: [
			'author',
			[sequelize.fn('COUNT', sequelize.col('author')), 'articles'],
			[sequelize.fn('SUM', sequelize.col('likes')), 'likes']
		],
		group: ['author'],
		order: [[sequelize.literal('likes'), 'DESC']]
	})
	console.log(authorsData)

	console.log(authorsData)
	res.json(authorsData)

})

module.exports = router
