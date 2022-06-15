const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const router = Router()

// /api/auth/signUp
router.post(
    '/signUp',
    [
      check('email', 'Введите корректную почту').trim().isEmail(),
        check('forename', 'Введите имя').trim().exists().matches(/[а-яА-ЯёЁa-zA-Z]+$/),
        check('surname', 'Введите фамилию').trim().exists().matches(/[а-яА-ЯёЁa-zA-Z]+$/),
      check('password', 'Минимальная длина пароля 6 символов').trim().
        isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    messange: 'Некорректные данные при регистрации'
                })
            }
            const {forename, surname, email, password} = req.body
            const candidate = await User.findOne({email})

            if (candidate) {
                return res.status(400).json({message: "Такой пользователь уже существует"})
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({forename, surname, email, password: hashedPassword})
            await user.save()
            res.status(201).json({message: "Регистрация прошла успешно"})

        } catch (e) {
            res.status(500).json({message: "Что-то пошло не так, попробуйте снова"})
        }
})



// /api/auth/signIn
router.post(
    '/signIn',
    [
        check('email', 'Введите корректную почту').trim().normalizeEmail().isEmail(),
        check('password', 'Введите пароль').trim().exists(),
        check('password', 'Минимальная длина пароля 6 символов').trim().
        isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректный данные при входе в систему'
                })
            }

            const {forename, surname, email, password} = req.body

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '24h' }
            )

            res.json({ token, userId: user.id, mail: user.email, fore:user.forename, sur:user.surname })

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

module.exports = router