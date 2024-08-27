import jsdom from 'jsdom'
import { NTHUAISError } from '$lib/errors.js'

export const parser = (HTML: string) => {
  const dom = new jsdom.JSDOM(HTML)
  const doc = dom.window.document

  const table = Array
    .from(doc.querySelectorAll('table'))
    .find(n => (n.textContent?.trim() ?? "")
    .startsWith('學號 Student Number'))
  
  if (!table) {
    throw new NTHUAISError('Transcript: No table found')
  }


  //First Row:  學號 Student Number：{studentid}　　姓名 Name：{name_zh}　　班級 Department & Class：{class_name_zh}　　
  //Second Row p:  修習總學分(包含及格,不及格及成績未到) Total credits( including passing, failing, and not submitted grades)：{total_credits}　已修及格畢業學分 Passing grade：{passed_credits}　成績未到畢業學分 Not submitted grade：{pending_credits}
  //Third Row: Header
  //Fourth Row: Data(year, semester, course_id, course_name, credits, grade, ge_type, ranking, t_scores)	
  //Last Row: same as second row		

  // Parse student info

  const studentText = table.querySelector('tr')?.textContent?.trim()
  const studentRegex = /學號 Student Number：(?<studentid>.+)　　姓名 Name：(?<name_zh>.+)　　班級 Department & Class：(?<class_name_zh>.+)/
  const studentMatch = studentText?.match(studentRegex)

  const student = {
    studentid: studentMatch?.groups?.studentid,
    name_zh: studentMatch?.groups?.name_zh,
    class_name_zh: studentMatch?.groups?.class_name_zh
  }


  // Parse grades

  const rows = table.querySelectorAll('tr')
  const courses = Array.from(rows).slice(3, -1).map(row => {
    const cells = row.querySelectorAll('td')

    const year = cells[0].textContent?.trim()
    const semester = cells[1].textContent?.trim()
    const course_id = cells[2].textContent?.trim()

    return `${year}${semester}${course_id}`
  })

  return {
    student: student,
    courses: courses
  }
}