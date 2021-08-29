import NodeFetch from 'node-fetch'
import * as crypto from 'crypto'

export const GET = async (url: string) => {
  return NodeFetch(url, { method: 'GET' })
}

export const POST = async (url: string) => {
  return NodeFetch(url, {
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded' 
    }
  })
}

export const createHashMD5 = (value: any) => crypto.createHash('md5').update(String(value)).digest('hex')

export const createIntRandom = (from: number, to: number) => Math.floor(Math.random() * (to - from + 1) + from)

export const makeChallenge = () => {
  const randInt1 = createIntRandom(0, 90)
  const randInt2 = createIntRandom(0, 90)
  const md5Str1 = createHashMD5(randInt1)
  const md5Str2 = createHashMD5(randInt2)

  return md5Str1 + md5Str2.slice(0, 2)
}
