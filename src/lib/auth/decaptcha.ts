import { baseUrl, ocrUrl } from "./const.js"
import { RetryableError } from "$lib/errors.js"

export const decaptcha = async () => {
  try {
    const response = await fetch(baseUrl)
    const body = await response.text()
    
    if (!body) {
      throw new RetryableError('Decaptcha: Empty response body of base URL')
    }

    const bodyMatch = body.match(/auth_img\.php\?pwdstr=([a-zA-Z0-9_-]+)/)

    if (!bodyMatch) {
      throw new RetryableError('Decaptcha: No captcha image URL found')
    }

    const captchaStr = bodyMatch[1]
    const captchaAns = await fetch(ocrUrl(captchaStr))
      .then(res => res.text())

    return { 
      captchaStr: captchaStr, 
      captchaAns: captchaAns
    }
  }
  catch (error) {
    throw error
  }
}