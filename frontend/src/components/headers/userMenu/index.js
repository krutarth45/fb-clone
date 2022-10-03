import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import DisplayAcc from './DisplayAccessibility'
import HelpSupport from './HelpSupport'
import Cookies from 'js-cookie'
import SettingsPrivacy from './SettingsPrivacy'

function UserMenu({ user }) {
  const [visible, setVisible] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const logOut = () => {
    dispatch({ type: 'LOGOUT', payload: null })
    Cookies.set('user', null)
    navigate('/')
  }
  return (
    <div className="mmenu">
      {visible === 0 && (
        <div>
          <Link to="/profile" className="mmenu_header hover3">
            <img src={user?.picture} alt="" />
            <div className="mmenu_col">
              <span>
                {user?.first_name} {user?.last_name}
              </span>
              <span>See your profile.</span>
            </div>
          </Link>
          <div className="mmenu_splitter"></div>
          <div className="mmenu_main hover3">
            <div className="small_circle">
              <i className="report_filled_icon"></i>
            </div>
            <div className="mmenu_col">
              <div className="mmenu_span1">Give Feedback</div>
              <div className="mmenu_span2">Help us improve Facebook.</div>
            </div>
          </div>
          <div className="mmenu_splitter"></div>
          <div className="mmenu_item hover3">
            <div className="small_circle">
              <i className="settings_filled_icon"></i>
            </div>
            <span>Settings & Privacy</span>
            <div className="rArrow" onClick={() => setVisible(1)}>
              <i className="right_icon"></i>
            </div>
          </div>
          <div className="mmenu_item hover3">
            <div className="small_circle">
              <i className="help_filled_icon"></i>
            </div>
            <span>Help & Support</span>
            <div className="rArrow" onClick={() => setVisible(2)}>
              <i className="right_icon"></i>
            </div>
          </div>
          <div className="mmenu_item hover3">
            <div className="small_circle">
              <i className="dark_filled_icon"></i>
            </div>
            <span>Display & Accessibility</span>
            <div className="rArrow" onClick={() => setVisible(3)}>
              <i className="right_icon"></i>
            </div>
          </div>
          <div
            className="mmenu_item hover3"
            onClick={() => {
              logOut()
            }}
          >
            <div className="small_circle">
              <i className="logout_filled_icon"></i>
            </div>
            <span>Logout</span>
          </div>
        </div>
      )}
      {visible === 1 && <SettingsPrivacy setVisible={setVisible} />}
      {visible === 2 && <HelpSupport setVisible={setVisible} />}
      {visible === 3 && <DisplayAcc setVisible={setVisible} />}
    </div>
  )
}

export default UserMenu
