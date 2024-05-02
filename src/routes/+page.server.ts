import NTHUAIS from '$lib/client.js'
import { fail } from '@sveltejs/kit'

export const actions = {
  signin: async ({ request, cookies }) => {

    const data = await request.formData()
    const studentID = data.get('studentID') as string
    const password = data.get('password') as string

    const client = new NTHUAIS()

    try {
      await client.signin(studentID, password)
      cookies.set('NTHUAISAuth', JSON.stringify(client.auth), { path: '/' })
      return {
        success: true,
        body: client.auth
      }
    }
    catch (error: any) {
      return fail(400, error.message)
    }
  },

  getTranscript: async ({ request, cookies }) => {
    const auth = cookies.get('NTHUAISAuth')
    if (!auth) return fail(400, { message: 'Not signed in' })

    const client = new NTHUAIS()
    client.auth = JSON.parse(auth)

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
};