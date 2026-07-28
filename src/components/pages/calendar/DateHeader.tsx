import type { KollavarshamDate } from "@/api/schemas/panchangamData"

type DateHeaderProps = {
  date: Date,
  kv_date: KollavarshamDate
}

export default function DateHeader({ date, kv_date }: DateHeaderProps) {
  return (
    <div className="flex flex-col">
      <p className="font-playfair-display font-semibold text-2xl text-center col-span-2">{date.toLocaleDateString('default', { 'weekday': 'long' })}</p>
      <p className="text-md font-inter font-medium text-secondary text-center"> {date.toLocaleDateString('default', { 'month': 'long' })} {date.getDate()}, {date.getFullYear()}</p>
      <p className="text-md font-inter font-medium text-secondary text-center"> {kv_date.kv_month_name_en} {kv_date.kv_day}, {kv_date.kv_year}</p>
    </div>
  )
}
