import { Form, Formik } from 'formik'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'
import * as Yup from 'yup'
import RegisterInput from '../inputs/registerInput'
import DateOfBirthSelect from './DateOfBirthSelect'
import GenderSelect from './GenderSelect'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function RegisterForm({ setVisible }) {
  const userInfos = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    bYear: new Date().getFullYear(),
    bMonth: new Date().getMonth() + 1,
    bDay: new Date().getDate(),
    gender: '',
  }
  const [user, setUser] = useState(userInfos)
  const [dateError, setDateError] = useState(null)
  const [genderError, setGenderError] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    first_name,
    last_name,
    email,
    password,
    bYear,
    bMonth,
    bDay,
    gender,
  } = user
  const registerSubmit = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/register`,
        { first_name, last_name, email, password, bYear, bMonth, bDay, gender },
      )
      setError(null)
      setLoading(false)
      setSuccess(data.message)
      const { message, ...rest } = data
      setTimeout(() => {
        dispatch({ type: 'LOGIN', payload: rest })
        Cookies.set('user', JSON.stringify(rest))
        navigate('/')
      }, 2000)
    } catch (error) {
      setLoading(false)
      setSuccess(null)
      setError(error.response.data.message)
    }
  }
  const yearTemp = new Date().getFullYear()
  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }
  const years = Array.from(new Array(108), (val, index) => yearTemp - index)
  const months = Array.from(new Array(12), (val, index) => 1 + index)
  const getDays = () => {
    return new Date(bYear, bMonth, 0).getDate()
  }
  const days = Array.from(new Array(getDays()), (val, index) => 1 + index)
  const registerValidation = Yup.object({
    first_name: Yup.string()
      .required("What's your First name ?")
      .min(2, 'Fisrt name must be between 2 and 16 characters.')
      .max(16, 'Fisrt name must be between 2 and 16 characters.')
      .matches(/^[aA-zZ]+$/, 'Numbers and special characters are not allowed.'),
    last_name: Yup.string()
      .required("What's your Last name ?")
      .min(2, 'Last name must be between 2 and 16 characters.')
      .max(16, 'Last name must be between 2 and 16 characters.')
      .matches(/^[aA-zZ]+$/, 'Numbers and special characters are not allowed.'),
    email: Yup.string()
      .required(
        "You'll need this when you log in and if you ever need to reset your password.",
      )
      .email('Enter a valid email address.'),
    password: Yup.string()
      .required(
        'Enter a combination of at least six numbers,letters and punctuation marks(such as ! and &).',
      )
      .min(6, 'Password must be atleast 6 characters.')
      .max(36, "Password can't be more than 36 characters"),
  })
  return (
    <div className="blur">
      <div className="register">
        <div className="register_header">
          <i className="exit_icon" onClick={() => setVisible(false)}></i>
          <span>Sign Up</span>
          <span>it's quick and easy</span>
        </div>
        <Formik
          enableReinitialize
          initialValues={user}
          validationSchema={registerValidation}
          onSubmit={() => {
            let currentDate = new Date()
            let pickedDate = new Date(bYear, bMonth - 1, bDay)
            let atleast14 = new Date(1970 + 14, 0, 1)
            if (currentDate - pickedDate < atleast14) {
              setDateError(
                'You should be atleast 14 years old to create an Account.',
              )
            }
            if (gender === '') {
              setGenderError('Gender is required.')
            }
            if (dateError === null && genderError === null) {
              registerSubmit()
            }
          }}
        >
          {(formik) => (
            <Form className="register_form">
              <div className="reg_line">
                <RegisterInput
                  type="text"
                  placeholder="First name"
                  name="first_name"
                  onChange={handleRegisterChange}
                />
                <RegisterInput
                  type="text"
                  placeholder="Surname"
                  name="last_name"
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="reg_line">
                <RegisterInput
                  type="text"
                  placeholder="Mobile number or email address"
                  name="email"
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="reg_line">
                <RegisterInput
                  type="password"
                  placeholder="New password"
                  name="password"
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="reg_col">
                <div className="reg_line_header">
                  Date of birth <i className="info_icon"></i>
                </div>
                <DateOfBirthSelect
                  bDay={bDay}
                  bMonth={bMonth}
                  bYear={bYear}
                  years={years}
                  dateError={dateError}
                  days={days}
                  months={months}
                  handleRegisterChange={handleRegisterChange}
                />
              </div>
              <div className="reg_col">
                <div className="reg_line_header">
                  Gender <i className="info_icon"></i>
                </div>
                <GenderSelect
                  handleRegisterChange={handleRegisterChange}
                  genderError={genderError}
                />
              </div>
              <div className="reg_infos">
                By clicking Sign Up, you agree to our{' '}
                <span>Terms, Data Policy &nbsp;</span>
                and <span>Cookie Policy.</span> You may receive SMS
                notifications from us and can opt out at any time.
              </div>
              <div className="reg_btn_wrapper">
                <button className="blue_btn open_signup">Sign Up</button>
              </div>
              <ClipLoader color="#1874f2" loading={loading} size={30} />
              {error && <div className="error_text">{error}</div>}
              {success && <div className="success_text">{success}</div>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
