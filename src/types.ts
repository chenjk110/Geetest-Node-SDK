export interface IGeetestConfig {
  geetestId: string
  geetestKey: string
  protocol?: string
  apiServer?: string
  uriRegister?: string
  uriValidate?: string
}

export interface IResRegister {
  success: 0 | 1
  /** 
   * 流水号，一次完整验证流程的唯一标识
   * 
   * Serial number, the unique identification of a complete verification process
   */
  challenge: string

  gt: string
}

export interface IResValidate {
  success: 0 | 1
  /** 
   * 核心校验数据
   * 
   * Key verification data
   */
  seccode:string
  
}

interface IBaseReqParams extends Record<any, any>  {
  /**	
   * JSON 格式化标识
   * 
   * JSON format ID
   */
  json_format?: string | number | boolean
  /**	
   * SDK 代码版本号
   * 
   * SDK code version number.
   */
  sdk?: string
  /**	
   * user_id 作为终端用户的唯一标识，确定用户的唯一性；
   * 作用于提供进阶数据分析服务，可在 api1 或 api2 接口传入，不传入也不影响验证服务的使用；
   * 若担心用户信息风险，可作预处理 ( 如哈希处理 ) 再提供到极验 
   * 
   * user_ id is used as the unique identification of the end user to determine the uniqueness of the user;
   * It is used to provide advanced data analysis services. 
   * It can be passed in through API1 or api2 interface, and it does not affect the use of authentication services;
   * If you are worried about the risk of user information, you can perform preprocessing (such as hash processing) 
   * and then provide it to the extreme test.
   */
  user_id?: string
  /**	
   * 客户端类型
   * - web（ PC 浏览器）
   * - h5（ 手机浏览器，包括 WebView ）
   * - native（ 原生 APP ）
   * - unknown（ 未知 ）
   * 
   * Client type
   * - web (PC browser)
   * - h5 (mobile browser, including WebView)
   * - native (native APP)
   * - unknown
   */
  client_type?: 'web' | 'h5' | 'native' | 'unknown'
  /**	
   * 客户端请求 SDK 服务器的 IP 地址 
   * 
   * The client requests the IP address of the SDK server
   */
  ip_address?: string
}

/**
 * `/register.php` 接口请求参数
 * 
 * `/register.php` interface request parameters
 * 
 * @example
 * ```
 * user_id=test
 *   &client_type=web
 *   &ip_address=127.0.0.1
 *   &digestmod=md5
 *   &gt=c9c4facd1a6feeb80802222cbb74ca8e
 *   &json_format=1
 * ```
 */
export interface IReqParamsRegister extends IBaseReqParams {
  /**	
   * 向极验申请的账号 ID
   * 
   * Account ID applied to polar inspection.
   */
  gt: string
  /**	
   * 生成唯一标识字符串的签名算法，默认暂支持 MD5
   * 
   * A signature algorithm that generates a unique identification string. 
   * By default, MD5 is temporarily supported.
   */
  digestmod?: 'md5'
}


/**
 * `/validate.php` 接口请求参数
 * 
 * `/validate.php` interface request parameters
 * 
 * @example
 * ```
 * user_id=test
 *   &client_type=web
 *   &ip_address=127.0.0.1
 *   &seccode=f7475f921a41f7ba79ae15e41658627c%7Cjordan
 *   &challenge=5a757e661e70fc8e307326912fee8e2c8u
 *   &json_format=1
 *   &sdk=java-servlet%3A3.1.0
 *   &captchaid=c9c4facd1a6feeb80802222cbb74ca8e
 * ```
 */
export interface IReqParamsValidate extends IBaseReqParams {
  /** 
   * 核心校验数据
   * 
   * Key verification data
   */
  seccode:	string
  /** 
   * 流水号，一次完整验证流程的唯一标识
   * 
   * Serial number, the unique identification of a complete verification process
   */
  challenge:	string

  /**
   * 
   * 向极验申请的账号id
   * 
   * Account ID applied to polar inspection
   */
  captchaid: string

  validate: string
}
