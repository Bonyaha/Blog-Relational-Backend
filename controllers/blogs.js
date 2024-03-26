const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { blogFinder, userExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
	const where = {}
	const order = [['likes', 'DESC']] // Order by likes in descending order

	if (req.query.search) {
		const searchKeyword = req.query.search
		where[Op.or] = [
			{ title: { [Op.iLike]: `%${searchKeyword}%` } },
			{ author: { [Op.iLike]: `%${searchKeyword}%` } }
		]
	}
	const blogs = await Blog.findAll({
		attributes: { exclude: ['userId'] },
		include: {
			model: User,
			attributes: ['name']
		},
		where,
		order
	})
	console.log(JSON.stringify(blogs, null, 2))
	res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
	res.json(req.blog) //we get req.blog from blogFinder middleware
})


router.post('/', userExtractor, async (req, res) => {
	const user = req.user
	const blog = await Blog.create({ ...req.body, userId: user.id })
	return res.status(201).json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
	req.blog.likes = req.body.likes
	await req.blog.save()

	res.json(req.blog)

})

router.delete('/:id', blogFinder, userExtractor, async (req, res) => {
	const blog = req.blog
	const user = req.user

	if (blog.userId !== user.id) {
		return res.status(403).json({ error: "Unauthorized: You are not the owner of this blog." })
	}
	await req.blog.destroy()
	return res.status(204).end()
})

module.exports = router