import NTHUAISLogin from '$lib/auth/index.js'
import { fail } from '@sveltejs/kit'

export const actions = {
  default: async ({ request }) => {

    const data = await request.formData()
    const studentID = data.get('studentID') as string
    const password = data.get('password') as string

    try {
      const result = await NTHUAISLogin(studentID, password)
      return {
        success: true,
        body: result
      }
    }
    catch (error: any) {
      return fail(400, error.message)
    }
  }
};