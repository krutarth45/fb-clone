import './style.css'
import { Link } from 'react-router-dom'
import { left } from '../../../data/home'
import LeftLink from './LeftLink'
import { ArrowDown1 } from '../../../svg'
import { useState } from 'react'
import Shortcut from './Shortcut'

function LeftHome({ user }) {
  const [seeMore, setSeeMore] = useState(false)
  return (
    <div className="left_home scrollbar">
      <Link to="/profile" className="left_link hover2">
        <img src={user?.picture} alt="" />
        <span>
          {user?.first_name} {user?.last_name}
        </span>
      </Link>
      {left.slice(0, 8).map((element, index) => (
        <LeftLink
          key={index}
          img={element.img}
          text={element.text}
          notification={element.notification}
        />
      ))}
      {!seeMore && (
        <div className="left_link hover2" onClick={() => setSeeMore(true)}>
          <div className="small_circle">
            <ArrowDown1 />
          </div>
          <span>See More</span>
        </div>
      )}
      {seeMore && (
        <div className="more_left">
          {left.slice(8, left.length).map((element, index) => (
            <LeftLink
              key={index}
              img={element.img}
              text={element.text}
              notification={element.notification}
            />
          ))}
          <div className="left_link hover2" onClick={() => setSeeMore(false)}>
            <div className="small_circle rotate360">
              <ArrowDown1 />
            </div>
            <span>See Less</span>
          </div>
        </div>
      )}
      <div className="splitter"></div>
      <div className="shortcut">
        <div className="heading">Your Shortcuts</div>
        <div className="edit_shortcut">Edit</div>
      </div>
      <div className="shortcut_list">
        <Shortcut link="/" img="../../images/ytb.png" name="Youtube" />
        <Shortcut link="/" img="../../images/insta.png" name="Instagram" />
      </div>
      <div
        className={`${
          seeMore ? 'relative_fb_copyright' : 'relative_fb_copyright'
        }`}
      >
        <Link to="/">Privacy</Link>
        <span>. </span>
        <Link to="/">Terms</Link>
        <span>. </span>
        <Link to="/">Advertising</Link>
        <span>. </span>
        <Link to="/">
          Ad Choices <i className="ad_choices_icon"></i>
        </Link>
        <span>. </span>
        <Link to="/">Cookies</Link>
        <span>. </span>
        <Link to="/">More</Link>
        <span>. </span> <br />
        Meta © 2022
      </div>
    </div>
  )
}

export default LeftHome
