import { randomBytes } from 'crypto'

export const generateUUID = () => randomBytes(20).toString('hex')
