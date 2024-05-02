import { NTHUAISError } from '$lib/errors.js'
import { signin } from '$lib/auth/index.js'
import { getTranscript } from '$lib/transcript/index.js'

export default class NTHUAIS {
  auth: {
    ACIXSTORE: string
    studentID: string
    password: string
    captchaStr: string
    captchaAns: string
  } | undefined

  constructor() {
    this.auth = undefined
  }

  async signin(username: string, password: string) {
    this.auth = await signin(username, password)
  }

  async getTranscript() {
    if (!this.auth) {
      throw new NTHUAISError('Transcript: Please sign in first')
    }

    return await getTranscript(this.auth.ACIXSTORE)
  }

}