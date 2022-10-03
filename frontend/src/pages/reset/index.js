import './style.css'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { useState } from 'react'
import SearchAccount from './SearchAccount'
import SendEmail from './SendEmail'
import CodeVerification from './CodeVerification'
import Footer from '../../components/login/Footer'
import ChangePassword from './ChangePassword'
export default function Reset() {
  const { user } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(0)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [conf_password, setConf_password] = useState('')
  const [error, setError] = useState('')
  const [userInfo, setUserInfo] = useState('')
  const logout = () => {
    Cookies.set('user', '')
    dispatch({
      type: 'LOGOUT',
    })
    navigate('/login')
  }
  return (
    <div className="reset">
      <div className="reset_header">
        <img src="../../../icons/facebook.svg" alt="" />
        {user ? (
          <div className="right_reset">
            <Link to="/profile">
              <img src={user.picture} alt="" />
            </Link>
            <button
              className="blue_btn"
              onClick={() => {
                logout()
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="right_reset">
            <button className="blue_btn">Login</button>
          </Link>
        )}
      </div>
      <div className="reset_wrap">
        {visible === 0 && (
          <SearchAccount
            email={email}
            setEmail={setEmail}
            error={error}
            setError={setError}
            setUserInfo={setUserInfo}
            setLoading={setLoading}
            setVisible={setVisible}
          />
        )}
        {visible === 1 && userInfo && (
          <SendEmail
            userInfo={userInfo}
            error={error}
            setError={setError}
            setLoading={setLoading}
            setVisible={setVisible}
          />
        )}
        {visible === 2 && (
          <CodeVerification
            code={code}
            setCode={setCode}
            error={error}
            setError={setError}
            userInfo={userInfo}
            setLoading={setLoading}
            setVisible={setVisible}
          />
        )}
        {visible === 3 && (
          <ChangePassword
            password={password}
            conf_password={conf_password}
            setConf_password={setConf_password}
            setPassword={setPassword}
            setError={setError}
            userInfo={userInfo}
            setLoading={setLoading}
          />
        )}
      </div>
      <Footer />
    </div>
  )
}
