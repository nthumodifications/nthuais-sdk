import { transcriptURL } from './const.js'
import { NTHUAISError } from '$lib/errors.js'
import { parser } from './parser.js'
import iconv from 'iconv-lite'

export const fetcher = async (ACIXSTORE: string) => {

  try {
    const responseHTML = await fetch(transcriptURL(ACIXSTORE))
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => iconv.decode(Buffer.from(arrayBuffer), 'big5').toString())

    const courses = parser(responseHTML)
    return courses
  }
  catch (error) {
    throw error
  }

}