import { IGeetestConfig, IReqParamsRegister, IReqParamsValidate, IResRegister, IResValidate } from './types'
import { API_PATHNAME_REGISTER, API_PATHNAME_VALIDATE, API_PROTOCOL, API_SERVER } from './constants'
import { URL } from 'url'
import NodeFetch from 'node-fetch'
import { version } from '../package.json'

const SDK_VER = `Node_${version}`

export class Geetest {

  private geetestId: string = ''
  private geetestKey: string = ''
  private apiServer = API_SERVER
  private protocol = API_PROTOCOL
  private uriRegister = API_PATHNAME_REGISTER
  private uriValidate = API_PATHNAME_VALIDATE

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

  private get defaultRegisterParams()  {
    const params: IReqParamsRegister = {
      gt:  this.geetestId,
      digestmod: 'md5',
      client_type: 'unknown',
      json_format: 1,
      sdk: SDK_VER,
    }
    return params
  }

  private get defaultValidateParams()  {
    const params: IReqParamsValidate = {
      digestmod: 'md5',
      client_type: 'unknown',
      json_format: 1,
      challenge: '',
      seccode: '',
      captchaid: '',
      sdk: SDK_VER,
    }
    return params
  }

  async register(params?: IReqParamsRegister): Promise<IResRegister> {
    params = Object.assign(this.defaultRegisterParams, params)
    const url = `${this.registerApiUri}?${new URLSearchParams(params).toString()}`
    const res = await NodeFetch(url, { method: 'GET' })
    if (!!params.json_format) return res.json()
    return { challenge: await res.text() }
  }
  
  async validate(params: IReqParamsValidate): Promise<IResValidate> {
    params = Object.assign(this.defaultValidateParams, params)
    const url = `${this.validateApiUri}?${new URLSearchParams(params).toString()}`
    const res = await NodeFetch(url, {
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded' 
      }
    })
    if (!!params.json_format) return res.json()
    return { seccode: await res.text() }
  }
}
