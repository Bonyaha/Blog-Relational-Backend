const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
	const users = await User.findAll({
		attributes: { exclude: ['passwordHash'] },
		include: {
			model: Blog,
			attributes: { exclude: ['userId'] }
		}
	})
	res.json(users)
})

router.post('/', async (req, res) => {
	const { username, name, password } = req.body
	if (!password) {
		return response.status(400).json({
			error: 'Password is required',
		})
	}
	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const user = await User.create({
		username: username,
		name: name,
		passwordHash: passwordHash
	})
	res.json(user)
})

router.get('/:id', async (req, res) => {
	const user = await User.findByPk(req.params.id)
	if (user) {
		res.json(user)
	} else {
		res.status(404).end()
	}
})

router.get('/username/:username', async (req, res) => {
	const user = await User.findOne({ where: { username: req.params.username } })
	if (user) {
		res.json(user)
	} else {
		res.status(404).json({ error: "User not found" })
	}
})

router.put('/:username', async (req, res) => {
	console.log(req.params)
	const { username: currentUsername } = req.params
	const { username: newUsername } = req.body

	const user = await User.findOne({ where: { username: currentUsername } })
	if (!user) {
		return res.status(404).json({ error: 'User not found' })
	}
	user.username = newUsername
	await user.save()
	res.json(user)
})


module.exports = router