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

export const validateFailImage = function (answer: number, fullBgIndex: number, imgGrpIndex: number) {

  const threads = 3
  const nameFullBg = createHashMD5(fullBgIndex).slice(0, 10)
  const nameBg = createHashMD5(imgGrpIndex).slice(10, 20)

  let decodedAnswer = ''

  for (let i = 0; i < 9; i = i + 1) {
      if (i % 2 == 0) {
          decodedAnswer += nameFullBg[i]
      } else {
          decodedAnswer += nameBg[i]
      }
  }

  const decodedX = decodedAnswer.slice(4)
  const intX = parseInt(decodedX, 16)

  let result = intX % 200

  if (result < 40) {
      result = 40
  }

  if (Math.abs(answer - result) < threads) {
      return 1
  } else {
      return 0
  }
}

export const decodeResponse = function (challenge: string, userResponse: any[]) {
  if (userResponse.length > 100) {
      return 0
  }
  const sampleNumbers = [1, 2, 5, 10, 50]
  const repeatedNumbers = []
  const key: Record<any, number> = {}

  let count = 0
  let i = 0
  let len = challenge.length

  for (; i < len; i = i + 1) {
      const c = challenge[i]
      if (repeatedNumbers.indexOf(c) === -1) {
          repeatedNumbers.push(c)
          key[c] = sampleNumbers[count % 5]
          count += 1
      }
  }

  let res = 0
  for (i = 0, len = userResponse.length; i < len; i = i + 1) {
      res += key[userResponse[i]] || 0
  }
  res = res - decodeRandBase(challenge)
  return res
}

export  const decodeRandBase = function (challenge:  string) {
  const strBase = challenge.slice(32)

  const len = strBase.length
  const tempArray = []

  for (let i = 0; i < len; i = i + 1) {
      const char = strBase[i]
      const charAscii = char.charCodeAt(0)
      const result = charAscii > 57
          ? charAscii - 87
          : charAscii - 48
      tempArray.push(result)
  }

  return tempArray[0] * 36 + tempArray[1]
}
