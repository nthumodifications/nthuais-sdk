import { NTHUAISError } from '$lib/errors.js'
import { signin, getAuth, setAuth } from '$lib/auth/index.js'
import { getTranscript } from '$lib/transcript/index.js'

export type Auth = {
  ACIXSTORE: string
  studentID: string
  password: string
  updated: string
}

export type EncryptedAuth = {
  auth: string
  updated: string
}

export default class NTHUAIS {
  auth: Auth | undefined
  key: string

  constructor(key: string = '') {
    this.auth = undefined
    this.key = key
  }


  // Auth

  async signin(username: string, password: string) {
    this.auth = await signin(username, password)
  }

  getAuth() {
    if (!this.auth) {
      throw new NTHUAISError('Auth: Please sign in first')
    }
    return getAuth(this.auth, this.key)
  }

  setAuth(encryptedAuth: EncryptedAuth) {
    this.auth = setAuth(encryptedAuth, this.key)
  }


  // Information

  async getTranscript() {
    if (!this.auth) {
      throw new NTHUAISError('Transcript: Please sign in first')
    }
    return await getTranscript(this.auth.ACIXSTORE)
  }

}