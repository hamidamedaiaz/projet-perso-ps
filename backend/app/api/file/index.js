const express = require('express')
const multer = require('multer')
const path = require('path')

const router = express.Router()

// Configuration de stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../upload'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext)
    cb(null, `${Date.now()}-${base}${ext}`)
  },
})

// Filtrage des types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'audio/mpeg', 'audio/mp3']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Type de fichier non autorisé'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30 Mo max
  },
})

// Route POST pour upload de fichier
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier reçu ou type non autorisé.' })
  }

  console.log(`[SERVER] Fichié recu et stocké à : ${req.file.path}`)

  res.status(200).json({
    message: 'Fichier uploadé !!',
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    path: req.file.path,
  })
})


module.exports = router
