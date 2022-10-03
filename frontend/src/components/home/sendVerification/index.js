import axios from 'axios'
import { useState } from 'react'
import './style.css'

function SendVerification({ user }) {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const sendVerificationMail = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/sendverification`,
        {},
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        },
      )
      setSuccess(data.message)
    } catch (error) {
      setError(error.response.data.message)
    }
  }
  return (
    <div className="send_verification">
      <span>
        Your account is not verified, Unverified accounts are deleted after 30
        days of Sign Up.
      </span>
      <a
        onClick={() => {
          sendVerificationMail()
        }}
      >
        Click here to resend a verification link.
      </a>
      {success && <div className="success_text">{success}</div>}
      {error && <div className="error_text">{error}</div>}
    </div>
  )
}

export default SendVerification
