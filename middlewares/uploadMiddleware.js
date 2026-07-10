import multer from 'multer'

//  Настраиваем хранилище
const storage = multer.memoryStorage()

//  фильтр картинки
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Разрешены только изображения!'), false)
  }
}

//  Собираем всё вместе и ставим лимит в 5 Мегабайт
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: fileFilter,
})
