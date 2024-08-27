import { signIn } from './signin.js'
import { decaptcha } from './decaptcha.js'
import { NTHUAISError, RetryableError } from '$lib/errors.js'

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
      else {
        decaptchaTries--
      }
    }
    catch (error) {
      if (error instanceof RetryableError) {
        decaptchaTries--
        continue
      }
      throw error
    }
  }

  if (decaptchaTries <= 0) {
    throw new NTHUAISError('Decaptcha: Failed to get captcha')
  }

  let signInTries = 3
  while (signInTries > 0) {
    try {
      const { ACIXSTORE } = await signIn(studentID, password, capStr, capAns)
      return {
        ACIXSTORE: ACIXSTORE,
        studentID: studentID,
        password: password,
        // captchaStr: capStr,
        // captchaAns: capAns,
        updated: new Date().toISOString()
      }
    }
    catch (error) {
      if (error instanceof RetryableError) {
        signInTries--
        continue
      }
      throw error
    }
  }

  if (signInTries === 0) {
    throw new NTHUAISError('SignIn: Failed to sign in')
  }

  throw new NTHUAISError('Unknown error')

}