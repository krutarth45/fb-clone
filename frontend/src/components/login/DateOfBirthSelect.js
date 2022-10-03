import { useMediaQuery } from 'react-responsive'

function DateOfBirthSelect({
  bDay,
  bMonth,
  bYear,
  years,
  handleRegisterChange,
  dateError,
  days,
  months,
}) {
  const view3 = useMediaQuery({
    query: '(min-width: 1170px)',
  })
  return (
    <div
      className="reg_grid"
      style={{ marginBottom: `${dateError && !view3 ? '80px' : '0px'}` }}
    >
      <select name="bDay" value={bDay} onChange={handleRegisterChange}>
        {days.map((day, i) => (
          <option value={day} key={i}>
            {day}
          </option>
        ))}
      </select>
      <select name="bMonth" value={bMonth} onChange={handleRegisterChange}>
        {months.map((month, i) => (
          <option value={month} key={i}>
            {month}
          </option>
        ))}
      </select>
      <select name="bYear" value={bYear} onChange={handleRegisterChange}>
        {years.map((year, i) => (
          <option value={year} key={i}>
            {year}
          </option>
        ))}
      </select>
      {dateError && (
        <div
          className={
            !view3 ? 'input_error' : 'input_error input_error_select_large'
          }
        >
          <div
            className={!view3 ? 'error_arrow_bottom' : 'error_arrow_left'}
          ></div>
          {dateError}
        </div>
      )}
    </div>
  )
}

export default DateOfBirthSelect
