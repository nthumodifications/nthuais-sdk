import { type EncryptedAuth } from '$lib/client.js'
import { NTHUAISError } from '$lib/errors.js'
import CryptoJS from 'crypto-js'
const { AES } = CryptoJS

export let decrypter = (encryptedAuth: EncryptedAuth, key: string) => {
  try {
    const { auth, updated } = encryptedAuth
    const bytes = AES.decrypt(auth, key)
    const plaintext = bytes.toString(CryptoJS.enc.Utf8)
    const { ACIXSTORE, studentID, password } = JSON.parse(plaintext) as Record<string, string>
    return {
      ACIXSTORE,
      studentID,
      password,
      updated
    }
  }
  catch (error) {
    throw new NTHUAISError('Auth: Invalid auth data')
  }
}