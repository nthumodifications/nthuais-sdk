export const baseUrl = 'https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/'

export const ocrUrl = (captchaStr: string) => `https://ocr.nthumods.com/?url=https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/auth_img.php?pwdstr=${captchaStr}`

export const preSelectEntryUrl = `${baseUrl}pre_select_entry.php`
export const preSelectEntrySettings = (studentID: string, password: string, captchaStr: string, captchaAns: string ): RequestInit => ({
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "content-type": "application/x-www-form-urlencoded",
    "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "upgrade-insecure-requests": "1",
  },
  "body": `account=${studentID}&passwd=${password}&passwd2=${captchaAns}&Submit=%B5n%A4J&fnstr=${captchaStr}`,
  "method": "POST"
})


export const selectEntryUrl = `${baseUrl}select_entry.php`
export const selectEntrySettings = (): RequestInit => ({
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Microsoft Edge\";v=\"120\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "upgrade-insecure-requests": "1"
  },
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
})

export const topUrl = (studentID: string, ACIXSTORE: string) => `${baseUrl}top.php?account=${studentID}&ACIXSTORE=${ACIXSTORE}`
export const topSettings = (): RequestInit => ({
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "frame",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "upgrade-insecure-requests": "1"
  },
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
})

export const inInqStdUrl = (ACIXSTORE: string) => `${baseUrl}IN_INQ_STU.php?ACIXSTORE=${ACIXSTORE}`
export const inInqStdSettings = (): RequestInit => ({
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "frame",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "upgrade-insecure-requests": "1",
  },
  "body": null,
  "method": "GET"
})

export const xp03MUrl = (ACIXSTORE: string) => `${baseUrl}xp03_m.htm?ACIXSTORE=${ACIXSTORE}`
export const xp03MSettings = (): RequestInit => ({
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "frame",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "upgrade-insecure-requests": "1"
  },
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
})

export const timeUrl = (studentID: string, ACIXSTORE: string) => `${baseUrl}time.php?account=${studentID}&ACIXSTORE=${ACIXSTORE}`
export const timeSettings = (): RequestInit => ({
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
})