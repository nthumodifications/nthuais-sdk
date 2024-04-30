import NTHUAISLogin from '$lib/auth/index.js' 

export const actions = {
  default: async ({ request }) => {

    const data = await request.formData()
    const studentID = data.get('studentID') as string
    const password = data.get('password') as string

    const result = await NTHUAISLogin(studentID, password)
    
    return {
      success: true,
      body: result
    }
  }
};