require('dotenv').config()

const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()
app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model { }
Blog.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	author: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	url: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	title: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	likes: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	}
}, {
	sequelize,
	underscored: true,
	timestamps: false,
	modelName: 'blog'
})

Blog.sync()

app.get('/api/blogs', async (req, res) => {
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

app.get('/api/blogs/:id', async (req, res) => {
	try {
		const blog = await Blog.findByPk(req.params.id)
		if (blog) {
			res.json(blog)
		} else {
			res.status(404).end()
		}
	} catch (error) {
		console.error('Error fetching blog:', error)
		res.status(500).send('Internal Server Error')
	}
})


app.post('/api/blogs', async (req, res) => {
	try {
		const blog = await Blog.create(req.body)
		return res.json(blog)
	} catch (error) {
		console.error('Error creating blog:', error)
		return res.status(400).json({ error: 'Failed to create blog entry.' })
	}
})


app.delete('/api/blogs/:id', async (req, res) => {
	try {
		const blog = await Blog.findByPk(req.params.id)
		if (!blog) {
			return res.status(404).json({ error: 'Blog not found' })
		}
		await blog.destroy()
		return res.status(204).end()
	} catch (error) {
		console.error('Error deleting blog:', error)
		return res.status(500).json({ error: 'Internal Server Error' })
	}
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
