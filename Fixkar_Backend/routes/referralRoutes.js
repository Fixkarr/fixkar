import express from 'express'
import { isAuth } from '../middlewares/isAuth.js'
import { getMyReferral } from '../controllers/referral.controller.js'

const referralRoutes = express.Router()

referralRoutes.get('/referral/get-my-referral', isAuth, getMyReferral)

export default referralRoutes 