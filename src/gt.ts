import { IGeetestConfig, IReqParamsRegister, IReqParamsValidate, IResRegister, IResValidate } from './types'
import { URL } from 'url'
import { version } from '../package.json'
import { createHashMD5, decodeResponse, GET, makeChallenge, POST, validateFailImage } from './utils'

const SDK_VER = `Node_${version}`
export class Geetest {

  private geetestId: string = ''
  private geetestKey: string = ''
  private protocol = 'http:'
  private apiServer = 'api.geetest.com'
  private uriRegister = '/register.php'
  private uriValidate = '/validate.php'

  private get serverApiUri() {
    return new URL(this.apiServer, this.protocol).toString()
  }

  private get registerApiUri() {
    return new URL(this.uriRegister, this.serverApiUri).toString()
  }

  private get validateApiUri() {
    return new URL(this.uriValidate, this.serverApiUri).toString()
  }

  constructor(config: IGeetestConfig) {
    Object.assign(this, config)
  }

  private get defaultRegisterParams(): IReqParamsRegister  {
    return {
      gt:  this.geetestId,
      digestmod: 'md5',
      client_type: 'unknown',
      json_format: 1,
      sdk: SDK_VER,
    }
  }

  private get defaultValidateParams(): IReqParamsValidate  {
    return {
      digestmod: 'md5',
      client_type: 'unknown',
      json_format: 1,
      challenge: '',
      seccode: '',
      captchaid: '',
      validate: '',
      sdk: SDK_VER,
    }
  }
  
  private isJsonFormat(params: Pick<IReqParamsRegister | IReqParamsValidate, 'json_format'>) {
    return !!params.json_format
  }

  async register(params?: IReqParamsRegister): Promise<IResRegister> {
    const { defaultRegisterParams, registerApiUri, isJsonFormat, geetestId, geetestKey } = this

    // normalize params
    params = Object.assign(defaultRegisterParams, params)

    try {
      const res = await GET(`${registerApiUri}?${new URLSearchParams(params)}`)

      const challenge: string = isJsonFormat(params) ? (await res.json()).challenge : await res.text()

      if (challenge.length !== 32) {
        throw new Error()
      }

      return {
        success: 1,
        challenge: createHashMD5(challenge + geetestKey),
        gt: geetestId
      }

    } catch (err) {
      return {
        success: 0,
        challenge: makeChallenge(),
        gt: geetestId
      }
    }
  }
  
  async validate(params: Omit<IReqParamsValidate, 'captchaid'>): Promise<boolean> {

    const { geetestKey, validateApiUri, defaultValidateParams, isJsonFormat  } = this

    const { challenge, validate, seccode } = params

    const validatePairs = validate.split('_')

    if (validatePairs.length === 3) {

        let [encodedAns, encodedFbii, encodedIgi] = validatePairs

        const decodedAns = decodeResponse(challenge, encodedAns)
        const decodedFbii = decodeResponse(challenge, encodedFbii)
        const decodedIgi = decodeResponse(challenge, encodedIgi)

        const validateResult = validateFailImage(decodedAns, decodedFbii, decodedIgi)

        return  validateResult === 1

    }

    if (validate === createHashMD5(`${geetestKey}geetest${challenge}`)) {

      try {
        // normalize params
        params = Object.assign(defaultValidateParams, params)
    
        const res = await POST(`${validateApiUri}?${new URLSearchParams(params)}`)
  
        const seccodeRes: string = isJsonFormat(params) ? (await res.json()).seccode :  await res.text()
  
        return seccodeRes === createHashMD5(seccode)
        
      } catch {
        return false
      }

    }

    return false
  }
}
