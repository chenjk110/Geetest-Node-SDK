import { IGeetestConfig, IReqParamsRegister, IReqParamsValidate, IResRegister, IResValidate } from './types'
import { URL } from 'url'
import { version } from '../package.json'
import { GET, POST } from './utils'

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
      sdk: SDK_VER,
    }
  }
  
  private isJsonFormat(params: IReqParamsRegister | IReqParamsValidate) {
    return !!params.json_format
  }

  async register(params?: IReqParamsRegister): Promise<IResRegister> {
    const { defaultRegisterParams, registerApiUri, isJsonFormat } = this

    // normalize params
    params = Object.assign(defaultRegisterParams, params)

    const res = await GET(`${registerApiUri}?${new URLSearchParams(params)}`)

    return isJsonFormat(params)
      ? res.json()
      : { challenge: await res.text() }
  }
  
  async validate(params: IReqParamsValidate): Promise<IResValidate> {
    const { defaultValidateParams, validateApiUri, isJsonFormat } = this
    
    // normalize params
    params = Object.assign(defaultValidateParams, params)

    const res = await POST(`${validateApiUri}?${new URLSearchParams(params)}`)
    
    return isJsonFormat(params)
      ? res.json()
      : { seccode: await res.text() }
  }
}
