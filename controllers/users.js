const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User } = require('../models')

router.get('/', async (req, res) => {
	const users = await User.findAll()
	res.json(users)
})

router.post('/', async (req, res) => {
	try {
		const { username, name, password } = req.body
		const saltRounds = 10
		const passwordHash = await bcrypt.hash(password, saltRounds)

		const user = await User.create({
			username: username,
			name: name,
			passwordHash: passwordHash
		})
		res.json(user)
	} catch (error) {
		return res.status(400).json({ error })
	}
})

router.get('/:id', async (req, res) => {
	const user = await User.findByPk(req.params.id)
	if (user) {
		res.json(user)
	} else {
		res.status(404).end()
	}
})

module.exports = router