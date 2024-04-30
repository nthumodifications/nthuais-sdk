import { baseUrl, ocrUrl } from "./const.js"

export const decaptcha = async () => {
  try {
    const response = await fetch(baseUrl)
    const body = await response.text()
    
    if (!body) {
      throw new Error('Empty response')
    }

    const bodyMatch = body.match(/auth_img\.php\?pwdstr=([a-zA-Z0-9_-]+)/)

    if (!bodyMatch) {
      throw new Error('No captcha image')
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