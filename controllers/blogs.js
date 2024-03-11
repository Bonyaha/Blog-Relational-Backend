const router = require('express').Router()
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
	req.blog = await Blog.findByPk(req.params.id)
	next()
}

router.get('/', async (req, res) => {
	try {
		const blogs = await Blog.findAll()

		const formattedBlogs = blogs.map(blog => {
			return `${blog.author}: '${blog.title}', ${blog.likes} likes`
		})
		// Combine the formatted blog entries into a single string
		const output = formattedBlogs.join('\n')
		console.log(output)

		console.log(JSON.stringify(blogs, null, 2))

		res.json(blogs)
	} catch (error) {
		console.error('Error fetching blogs:', error)
		res.status(500).send('Internal Server Error')
	}
})

router.get('/:id', blogFinder, async (req, res) => {
	try {
		if (req.blog) {
			res.json(req.blog)
		} else {
			res.status(404).end()
		}
	} catch (error) {
		console.error('Error fetching blog:', error)
		res.status(500).send('Internal Server Error')
	}
})


router.post('/', async (req, res) => {
	try {
		const blog = await Blog.create(req.body)
		return res.json(blog)
	} catch (error) {
		console.error('Error creating blog:', error)
		return res.status(400).json({ error: 'Failed to create blog entry.' })
	}
})


router.delete('/:id', blogFinder, async (req, res) => {
	try {
		if (!req.blog) {
			return res.status(404).json({ error: 'Blog not found' })
		}
		await req.blog.destroy()
		return res.status(204).end()
	} catch (error) {
		console.error('Error deleting blog:', error)
		return res.status(500).json({ error: 'Internal Server Error' })
	}
})

router.put('/:id', blogFinder, async (req, res) => {
	try {
		if (!req.blog) {
			return res.status(404).json({ error: 'Blog not found' })
		}

		req.blog.likes = req.body.likes
		await req.blog.save()

		res.json(req.blog)
	} catch (error) {
		console.error('Error updating blog likes:', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})




module.exports = router