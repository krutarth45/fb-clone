import { Form, Formik } from 'formik'
import { Link } from 'react-router-dom'
import LoginInput from '../../components/inputs/loginInput'
import * as Yup from 'yup'
import axios from 'axios'
export default function CodeVerification({
  code,
  setCode,
  error,
  setError,
  userInfo,
  setLoading,
  setVisible,
}) {
  const handleCodeVerification = async () => {
    try {
      setLoading(true)
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/validateresetcode`,
        {
          email: userInfo.email,
          code: code,
        },
      )
      setVisible(3)
      setLoading(false)
      setError('')
    } catch (error) {
      setLoading(false)
      setError(error.response.data.message)
    }
  }
  const validateCode = Yup.object({
    code: Yup.string()
      .required('Code is required')
      .min('6', 'Code must be 6 characters.')
      .max('6', 'Code must be 6 characters.'),
  })
  return (
    <div className="reset_form">
      <div className="reset_form_header">Code verification</div>
      <div className="reset_form_text">
        Please enter code that been sent to your email.
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          code,
        }}
        validationSchema={validateCode}
        onSubmit={() => handleCodeVerification()}
      >
        {(formik) => (
          <Form>
            <LoginInput
              type="text"
              name="code"
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code"
            />
            {error && <div className="error_text">{error}</div>}
            <div className="reset_form_btns">
              <Link to="/login" className="gray_btn">
                Cancel
              </Link>
              <button type="submit" className="blue_btn">
                Continue
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
