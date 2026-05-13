import { useState } from "react";

import dayjs from 'dayjs'

import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(weekOfYear)
dayjs.extend(weekday)

function getCurrentDate(): Date {
  return new Date(Date.now())
}


function getFirstDayOfWeek(year: number, month: number, targetDayOfWeek: number = 0): Date {

  const firstDayOfMonth = new Date(year, month, 1)

  const dayOfWeek = firstDayOfMonth.getDay()

  const offset = (targetDayOfWeek - dayOfWeek) % 7

}


function getDays(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1)

  const dayOfWeek = firstDayOfMonth.getDay()

  const offset = 

  const firstDayOfWeek = if (firstDayOfMonth.day === 0) return firstDayOfMonth else firstDayOfMonth.weekday(-7)

  for 





  

}





export default function CustomCalendar() {

  const [currentMonth, setCurrentMonth] = useState(getCurrentDate)



  return ();
}
