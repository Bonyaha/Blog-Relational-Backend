const router = require('express').Router()
const { Blog } = require('../models')

router.get('/', async (req, res) => {
	const blogs = await Blog.findAll()
	console.log(JSON.stringify(blogs, null, 2))
	res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
	res.json(req.blog) //we get req.blog from blogFinder middleware
})


router.post('/', async (req, res) => {
	const blog = await Blog.create(req.body)
	return res.status(201).json(blog)
})

router.delete('/:id', blogFinder, async (req, res) => {
	await req.blog.destroy()
	return res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
	req.blog.likes = req.body.likes
	await req.blog.save()

	res.json(req.blog)

})

module.exports = router