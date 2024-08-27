import { type Auth } from '$lib/client.js'
import { NTHUAISError } from '$lib/errors.js'
import CryptoJS from 'crypto-js'
const { AES } = CryptoJS

export let encrypter = (auth: Auth, key: string) => {
  try {
    const { ACIXSTORE, studentID, password, updated } = auth
    const data = JSON.stringify({ ACIXSTORE, studentID, password })
    const ciphertext = AES.encrypt(data, key).toString()
    return {
      auth: ciphertext,
      updated
    }
  }
  catch (error) {
    throw new NTHUAISError('Auth: Error getting auth')
  }
}