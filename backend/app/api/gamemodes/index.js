const { Router } = require('express')
const Gamemodes = require('../../models/gamemode.model')

const router = new Router()

router.get('/', (req, res) => {
  try {
    res.status(200).json(Gamemodes.get())
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
})

router.post('/', (req, res) => {
    try {
        res.status(201).json(Gamemodes.create(req.body, false));
    } catch(err) {
        res.status(500).json(err);
        console.log(err);
    }
})

module.exports = router
