require('dotenv').config()

const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()
app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model { }
Blog.init({
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	author: { type: DataTypes.TEXT, allowNull: false },
	url: { type: DataTypes.TEXT, allowNull: false },
	title: { type: DataTypes.TEXT, allowNull: false },
	likes: { type: DataTypes.INTEGER, defaultValue: 0, }
}, {
	sequelize,
	underscored: true,
	timestamps: false,
	modelName: 'blog'
})

app.get('/api/blogs', async (req, res) => {
	try {
		const blogs = await Blog.findAll()

		const formattedBlogs = blogs.map(blog => {
			return `${blog.author}: '${blog.title}', ${blog.likes} likes`
		})

		// Combine the formatted blog entries into a single string
		const output = formattedBlogs.join('\n')
		console.log(output)
		res.send(formattedBlogs)
	} catch (error) {
		console.error('Error fetching blogs:', error)
		res.status(500).send('Internal Server Error')
	}
})


app.post('/api/blogs', async (req, res) => {
	try {
		const blog = await Note.create(req.body)
		return res.json(blog)
	} catch (error) {
		return res.status(400).json({ error })
	}
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
