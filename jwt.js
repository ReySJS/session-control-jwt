import jwt from 'jsonwebtoken';

const secret = "5011058ce2a9316d8d76c904d1f21e45"

export const sign = payload => jwt.sign(payload, secret, { expiresIn: 86400 })
export const verify = token => jwt.verify(token, secret)
