const {Router} = require('express')
const config = require('config')
const shortid = require('shortid')
const SecondTask = require('../models/SecondTask')
const auth = require('../middleware/auth.middleware')
const router = Router()
//Добавляем ответ ученика
router.post('/ans', auth, async (req, res) => {
    try {
        const {answer, attempt} = req.body
        let score
        attempt <= 0 ? score = 0 : score = 100 - attempt*10 + 10
        if (score < 0) score = 0
        await SecondTask.updateOne({user_id: req.user.userId, _id: req.body._id}, {$set: {answer: answer, attempt: attempt, score: score}})
        res.json(req.body._id)

    } catch (e) {
        res.status(500).json( {message: "Что-то пошло не так, попробуйте снова" })
    }
})
//

//Создание документа с генерацией данных
router.post('/generate/1', auth, async (req, res) => {
    try {
        const one = 1
        const ans = await new SecondTask({
            input: one,
            user_id: req.user.userId
        })
        await ans.save()
        res.status(201).json({ ans })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post('/generate/2', auth, async (req, res) => {
    try {
        const two = 2
        const ans = await new SecondTask({
            input: two,
            user_id: req.user.userId
        })
        await ans.save()
        res.status(201).json({ ans })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post('/generate/3', auth, async (req, res) => {
    try {
        const three = 3
        const ans = await new SecondTask({
            input: three,
            user_id: req.user.userId
        })
        await ans.save()
        res.status(201).json({ ans })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

//Поиск всех попыток
router.get('/', auth, async (req, res) => {
    try {
        const answer = await SecondTask.find({user_id: req.user.userId})
        res.json(answer)
    } catch (e) {
        res.status(500).json( {message: "Что-то пошло не так, попробуйте снова" })
    }
})

//Получение id результата определенного задания
router.get('/result/:id', auth, async (req, res) => {
    try {
        const ans = await SecondTask.findById(req.params.id)
        res.json(ans)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

//Получение текущего задания по id
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await SecondTask.findById(req.params.id)
        res.json(task)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})


module.exports = router
