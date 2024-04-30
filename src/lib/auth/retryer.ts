import { signIn } from './signin.js'
import { decaptcha } from './decaptcha.js'

export let retryer = async (studentID: string, password: string) => {
  
  let capStr = ''
  let capAns = ''

  let decaptchaTries = 3
  while (decaptchaTries > 0) {
    try {
      const { captchaStr, captchaAns } = await decaptcha()
      if (captchaAns && captchaAns.length === 6) {
        capStr = captchaStr
        capAns = captchaAns
        break
      }
    }
    catch (error) {
      decaptchaTries--
    }
  }

  if (decaptchaTries === 0) {
    throw new Error('Decaptcha error')
  }

  let signInTries = 3

  while (signInTries > 0) {
    try {
      const { ACIXSTORE } = await signIn(studentID, password, capStr, capAns)
      return {
        ACIXSTORE: ACIXSTORE,
        studentID: studentID,
        password: password,
        captchaStr: capStr,
        captchaAns: capAns
      }
    }
    catch (error) {
      signInTries--
    }
  }

  if (signInTries === 0) {
    throw new Error('Sign in error')
  }

}