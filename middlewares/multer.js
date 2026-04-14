import multer from 'multer'

const storage = multer.memoryStorage()

export const upload = multer({ storage }).fields([
    { name: "file", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 }
]);