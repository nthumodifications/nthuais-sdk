import NTHUAIS from '$lib/client.js'
import { fail } from '@sveltejs/kit'
import { inflateRaw } from 'zlib';

export const actions = {
  signin: async ({ request, cookies }) => {

    const data = await request.formData()
    const studentID = data.get('studentID') as string
    const password = data.get('password') as string

    const client = new NTHUAIS()

    try {
      await client.signin(studentID, password)
      cookies.set('NTHUAISAuth', JSON.stringify(client.getAuth()), { path: '/' })
      return {  
        success: true,
        body: client.getAuth()
      }
    }
    catch (error: any) {
      return fail(400, error.message)
    }
  },

  
  getTranscript: async ({ request, cookies }) => {

    const raw = cookies.get('NTHUAISAuth')
    if (!raw) return fail(400, { message: 'Not signed in' })

    const client = new NTHUAIS()

    let auth = null
    try {
      auth = JSON.parse(raw)
      client.setAuth(auth)
    }
    catch (error: any) {
      cookies.delete('NTHUAISAuth', { path: '/' })
      return fail(400, error.message)
    }

    try {
      const transcript = await client.getTranscript()
      return {
        success: true,
        body: transcript
      }
    }
    catch (error: any) {
      return fail(400, error.message)
    }
  }
}