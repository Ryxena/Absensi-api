import express from 'express'
import { 
    userAbsen,
    getUsersAbsen,
    getUsersById,
    createUser,
    updateUser
} from '../controllers/userController.js'
import { verifyUser } from '../middleware/authUser.js'
const router = express.Router()

router.get('/user/:id', getUsersById)
router.get('/absen/:id', getUsersAbsen)
router.post('/absen', userAbsen)
router.post('/register', createUser)
router.patch('/user/:id', updateUser)

export default router