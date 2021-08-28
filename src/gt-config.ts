import { URL } from 'url'
import { API_PROTOCOL, API_SERVER } from './constants'

export interface IGeetestConfig {
  geetestId: string
  geetestKey: string
  protocol?: string
  apiServer?: string
}

export class GeetestConfig implements IGeetestConfig {
  geetestId: string = ''
  geetestKey: string = ''
  apiServer = API_SERVER
  protocol = API_PROTOCOL

  get apiURI() {
    return new URL(this.apiServer, this.protocol).toString()
  }
}
