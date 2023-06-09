/**
 * 记录日志
 */
import config from '../common/config'
import uniUtil from './uni'

export default function http(param: {
  url: string
  method: 'GET' | 'POST'
  data: any
  hideLoading?: boolean
},isThird?:Boolean) {
  let url = param.url,
    method = param.method,
    data = param.data || {},
    hideLoading = param.hideLoading || false

  let requestUrl = config.url + url
  if(isThird){
    requestUrl = url
  }
  if (!hideLoading) {
    uni.showLoading({
      title: '加载中...',
    })
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: requestUrl,
      data: data,
      method: method,
      timeout: 30000,
      header: {
        'content-type': 'application/json',
      },
      success: (res) => {
        if (
          res.statusCode === 403 ||
          (res.statusCode === 502 && res.statusCode)
        ) {
          uniUtil.showModal('网络超时，请重试')
          return
        }
        resolve(res.data)
      },
      fail: (e: any) => {
        uniUtil.showModal('网络超时，请重试')
        if (e.errno !== '600001') {
        }
        reject(e)
      },
      complete() {
        if (!hideLoading) {
          uni.hideLoading()
        }
        resolve({})
        return
      },
    })
  })
}
