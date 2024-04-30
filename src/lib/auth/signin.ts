import { baseUrl, 
  preSelectEntryUrl, preSelectEntrySettings, 
  selectEntryUrl, selectEntrySettings,
  topUrl, topSettings,
  inInqStdUrl, inInqStdSettings,
  xp03MUrl, xp03MSettings,
  timeUrl, timeSettings
} from './const.js'

export const signIn = async (studentID: string, password: string, captchaStr: string, captchaAns: string) => {
  try {
    const response = await fetch(
      preSelectEntryUrl, 
      preSelectEntrySettings(studentID, password, captchaStr, captchaAns)
    )

    const responseHTML = await response.arrayBuffer()
      .then(buffer => {
        const decoder = new TextDecoder("big5")
        const text = decoder.decode(buffer)
        return text
      })

    const redirectMatch = responseHTML.match(
      /url=(select_entry\.php\?ACIXSTORE=[a-zA-Z0-9_-]+&hint=[0-9]+)/
    )

    const newResponse = await fetch(
      baseUrl + redirectMatch?.[1],
      selectEntrySettings()
    )

    const newResponseHTML = await newResponse.arrayBuffer()
      .then(buffer => {
        const decoder = new TextDecoder("big5")
        const text = decoder.decode(buffer)
        return text
      })

    if (responseHTML.match('驗證碼輸入錯誤!')) {
      throw new Error('Captcha error')
    }

    if (responseHTML.match('15分鐘內登錄錯誤')) {
      throw new Error('Captcha error')
    }

    if (newResponseHTML.match('帳號或密碼錯誤')) {
      throw new Error('Credentials error')
    }

    if (responseHTML.match(/ACIXSTORE=([a-zA-Z0-9_-]+)/)?.length === 0) {
      throw new Error('ACIXSTORE error')
    }

    const ACIXSTORE = responseHTML.match(/ACIXSTORE=([a-zA-Z0-9_-]+)/)?.[1]

    if (!ACIXSTORE) {
      throw new Error('ACIXSTORE error')
    }

    const topResponse = await fetch(
      topUrl(studentID, ACIXSTORE),
      topSettings()
    )

    const inInqStdResponse = await fetch(
      inInqStdUrl(ACIXSTORE),
      inInqStdSettings()
    )

    const xp03MResponse = await fetch(
      xp03MUrl(ACIXSTORE),
      xp03MSettings()
    )

    const timeResponse = await fetch(
      timeUrl(studentID, ACIXSTORE),
      timeSettings()
    )

    return {
      ACIXSTORE: ACIXSTORE
    }
  }
  catch (error) {
    throw error
  }
}