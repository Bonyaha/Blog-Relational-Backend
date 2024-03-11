const router = require('express').Router()
const { Blog } = require('../models')

router.get('/', async (req, res, next) => {
	try {
		const blogs = await Blog.findAll()
		console.log(JSON.stringify(blogs, null, 2))
		res.json(blogs)
	} catch (error) {
		next(error)
	}
})

router.get('/:id', blogFinder, async (req, res, next) => {
	try {
		res.json(req.blog) //we get req.blog from blogFinder middleware
	} catch (error) {
		next(error)
	}
})


router.post('/', async (req, res, next) => {
	try {
		const blog = await Blog.create(req.body)
		return res.status(201).json(blog)
	} catch (error) {
		next(error)
	}
})


router.delete('/:id', blogFinder, async (req, res, next) => {
	try {
		await req.blog.destroy()
		return res.status(204).end()
	} catch (error) {
		next(error)
	}
})

router.put('/:id', blogFinder, async (req, res, next) => {
	try {
		req.blog.likes = req.body.likes
		await req.blog.save()

		res.json(req.blog)
	} catch (error) {
		next(error)
	}
})




module.exports = router