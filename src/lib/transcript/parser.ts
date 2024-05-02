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


  // Parse credits

  const creditsText = table.querySelectorAll('tr')[1]?.querySelector('p')?.textContent?.trim()
  const creditsRegex = /修習總學分\(包含及格,不及格及成績未到\) Total credits\( including passing, failing, and not submitted grades\)：(?<total_credits>.+)　已修及格畢業學分 Passing grade：(?<passed_credits>.+)　成績未到畢業學分 Not submitted grade：(?<pending_credits>.+)/
  const creditsMatch = creditsText?.match(creditsRegex)

  const credits = {
    total_credits: parseInt(creditsMatch?.groups?.total_credits ?? "0"),
    passed_credits: parseInt(creditsMatch?.groups?.passed_credits ?? "0"),
    pending_credits: parseInt(creditsMatch?.groups?.pending_credits ?? "0")
  }


  // Parse grades

  const rows = table.querySelectorAll('tr')
  const grades = Array.from(rows).slice(3, -1).map(row => {
    const cells = row.querySelectorAll('td')

    const year = cells[0].textContent?.trim()
    const semester = cells[1].textContent?.trim()
    const course_id = cells[2].textContent?.trim()

    const course_name_raw = cells[3].textContent?.trim().split('\n')
    const name_zh_ge = course_name_raw?.[0]?.trim() ?? ""
    const grade_text = cells[5].textContent?.trim()
    const [name_zh, ge_description] = name_zh_ge.split(' -- ')

    return {
      raw_id: `${year}${semester}${course_id}`,
      year: year,
      semester: semester,
      course_id: course_id,
      name_zh: name_zh,
      name_en: course_name_raw?.[2]?.trim() ?? "",
      credits: parseInt(cells[4].textContent?.trim() ?? "0"),
      grade: !grade_text?.startsWith('成績未到') ? grade_text : '成績未到',
      ge_type: cells[6].textContent?.trim().replace('Elective GE course:', ''),
      ge_description: ge_description,
      ranking: cells[7].querySelector('div')?.textContent?.trim(),
      t_scores: cells[8].textContent?.trim(),
    }
  })


  //table[4]: ranking and grades
  //row 0: explanation
  //row 1,2: headers
  //row 3~: data(year, sem, gpa, t_score_avg, relative_avg, credits, actual_credits, num_of_courses, summer_credits, transfer_credits, letter_class_rank, letter_dept_rank, t_score_class_rank, t_score_dept_rank, relative_class_rank, relative_dept_rank, comments)
  //row 4: 等級制累計系排名/總人數、累計班排名/總人數、GPA(至{gpa_cum_year_tw}學年暑期)： {letter_cum_dept_rank}、{letter_cum_class_rank}、{gpa}
  // Letter Grade Cumulative Department ranking/Total number of students、GPA (to the summer classes of Academic Year {gpa_cum_year}): {letter_cum_dept_rank}、{letter_cum_class_rank}、{gpa}
  // 修課相對成績學業累計系排名/總人數、累計班排名/總人數、修課相對成績學業平均成績(至{gpa_cum_year_tw}學年暑期)： {relative_cum_dept_rank}、{relative_cum_class_rank}、{relative_cum}
  // Relative Grade Cumulative Department ranking/Total number of students、Relative Grade Average (to the summer classes of Academic Year {gpa_cum_year}): {relative_cum_dept_rank}、{relative_cum_class_rank}、{relative_cum}
  // T分數學業累計系排名/總人數、T分數成績學業平均成績(至{gpa_cum_year_tw}學年暑期)： {t_scores_cum_dept_rank}、{t_scores_cum_class_rank}、{t_scores_cum}
  // T Scores Cumulative Department ranking/Total number of students、T Scores Average (to the summer classes of Academic Year {gpa_cum_year}): {t_scores_cum_dept_rank}、{t_scores_cum_class_rank}、{t_scores_cum}

  // Parse ranking

  const rankingTable = Array
    .from(doc.querySelectorAll('table'))
    .find(n => (n.textContent?.trim() ?? "")
    .startsWith('以下各排名僅供參考'))
  
  if (!rankingTable) {
    throw new NTHUAISError('Transcript: No ranking table found')
  }

  const rankingRows = rankingTable.querySelectorAll('tr')
  const rankingData = Array.from(rankingRows).slice(3, -1).map(row => {
    const cells = row.querySelectorAll('td')

    return {
      year: cells[0].textContent?.trim(),
      semester: cells[1].textContent?.trim(),
      gpa: cells[2].textContent?.trim(),
      t_score_avg: cells[3].textContent?.trim(),
      relative_avg: cells[4].textContent?.trim(),
      credits: parseInt(cells[5].textContent?.trim() ?? "0"),
      actual_credits: parseInt(cells[6].textContent?.trim() ?? "0"),
      num_of_courses: parseInt(cells[7].textContent?.trim() ?? "0"),
      summer_credits: parseInt(cells[8].textContent?.trim() ?? "0"),
      transfer_credits: parseInt(cells[9].textContent?.trim() ?? "0"),
      letter_class_rank: cells[10].textContent?.trim(),
      letter_dept_rank: cells[11].textContent?.trim(),
      t_score_class_rank: cells[12].textContent?.trim(),
      t_score_dept_rank: cells[13].textContent?.trim(),
      relative_class_rank: cells[14].textContent?.trim(),
      relative_dept_rank: cells[15].textContent?.trim(),
      comments: cells[16].textContent?.trim()
    }
  })

  //TODO: handle 112	10	**	**	**	**	**	**	**	**	-	-	-	-	-	-


  // Parse cumulative ranking
  
  const rankingCumulativeRow = rankingRows[rankingRows.length - 1]
  const rankingCumulativeCells = rankingCumulativeRow.querySelectorAll('td > div')

  const letterCumulative = Array
    .from(rankingCumulativeCells[0]?.childNodes)
    .find(n => n.textContent?.startsWith('等級制累計系排名'))?.textContent?.trim()
  const letterCumulativeRegex = /等級制累計系排名\/總人數、累計班排名\/總人數、GPA\(至(?<gpa_cum_year_tw>.+)\)： (?<letter_cum_dept_rank>.+)、(?<letter_cum_class_rank>.+)、(?<gpa>.+)/
  const letterCumulativeMatch = letterCumulative?.match(letterCumulativeRegex)
  
  const letter = {
    gpa_cum_year_tw: letterCumulativeMatch?.groups?.gpa_cum_year_tw,
    letter_cum_dept_rank: letterCumulativeMatch?.groups?.letter_cum_dept_rank,
    letter_cum_class_rank: letterCumulativeMatch?.groups?.letter_cum_class_rank,
    gpa: letterCumulativeMatch?.groups?.gpa
  }


  const relativeCumulative = rankingCumulativeCells[1].firstChild?.textContent?.trim()
  const relativeCumulativeRegex = /修課相對成績學業累計系排名\/總人數、累計班排名\/總人數、修課相對成績學業平均成績\(至(?<gpa_cum_year_tw>.+)\)： (?<relative_cum_dept_rank>.+)、(?<relative_cum_class_rank>.+)、(?<relative_cum>.+)/
  const relativeCumulativeMatch = relativeCumulative?.match(relativeCumulativeRegex)

  const relative = {
    gpa_cum_year_tw: relativeCumulativeMatch?.groups?.gpa_cum_year_tw,
    relative_cum_dept_rank: relativeCumulativeMatch?.groups?.relative_cum_dept_rank,
    relative_cum_class_rank: relativeCumulativeMatch?.groups?.relative_cum_class_rank,
    relative_cum: relativeCumulativeMatch?.groups?.relative_cum
  }


  const tScoresCumulative = rankingCumulativeCells[2].firstChild?.textContent?.trim()
  const tScoresCumulativeRegex = /T分數學業累計系排名\/總人數、T分數成績學業平均成績\(至(?<gpa_cum_year_tw>.+)\)： (?<t_scores_cum_dept_rank>.+)、(?<t_scores_cum_class_rank>.+)、(?<t_scores_cum>.+)/
  const tScoresCumulativeMatch = tScoresCumulative?.match(tScoresCumulativeRegex)

  const tScores = {
    gpa_cum_year_tw: tScoresCumulativeMatch?.groups?.gpa_cum_year_tw,
    t_scores_cum_dept_rank: tScoresCumulativeMatch?.groups?.t_scores_cum_dept_rank,
    t_scores_cum_class_rank: tScoresCumulativeMatch?.groups?.t_scores_cum_class_rank,
    t_scores_cum: tScoresCumulativeMatch?.groups?.t_scores_cum
  }


  const rankingCumulative = {
    letter: letter,
    relative: relative,
    t_scores: tScores
  }

  const ranking = {
    data: rankingData,
    cumulative: rankingCumulative
  }

  return {
    student: student,
    credits: credits,
    grades: grades,
    ranking: ranking
  }

}