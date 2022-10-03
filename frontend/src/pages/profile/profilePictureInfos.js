import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProfilePicture from '../../components/profilePicture'
import Friendship from './friendship'

const ProfilePictureInfos = ({ profile, visitor, photos, othername }) => {
  const [show, setShow] = useState(false)
  const pRef = useRef(null)
  return (
    <div className="profile_img_wrap">
      {show && <ProfilePicture setShow={setShow} pRef={pRef} photos={photos} />}
      <div className="profile_w_left">
        <div className="profile_w_img">
          <div
            className="profile_w_bg"
            ref={pRef}
            style={{
              backgroundSize: 'cover',
              backgroundImage: `url(${profile.picture})`,
            }}
          ></div>
          {!visitor && (
            <div
              className="profile_circle hover1"
              onClick={() => setShow(true)}
            >
              <i className="camera_filled_icon"></i>
            </div>
          )}
        </div>
        <div className="profile_w_col">
          <div className="profile_name">
            {profile.first_name} {profile.last_name}
            <div className="othername">{othername && `(${othername})`}</div>
          </div>
          <div className="profile_friend_count">
            {profile?.friends && (
              <div className="profile_card_count">
                {profile?.friends.length === 0
                  ? ''
                  : profile?.friends.length === 1
                  ? '1 Friend'
                  : `${profile?.friends.length} Friends`}
              </div>
            )}
          </div>
          <div className="profile_friend_imgs">
            {profile?.friends &&
              profile.friends.slice(0, 6).map((friend, index) => (
                <Link to={`/profile/${friend.username}`} key={index}>
                  <img
                    src={friend.picture}
                    key={index}
                    alt=""
                    style={{ transform: `translateX(-${index * 5}px)` }}
                  />
                </Link>
              ))}
          </div>
        </div>
      </div>
      {visitor ? (
        <Friendship
          friendshipp={profile?.friendship}
          profileid={profile?._id}
        />
      ) : (
        <div className="profile_w_right">
          <div className="blue_btn">
            <img src="../../../icons/plus.png" className="invert" alt="" />
            <span>Add to Story</span>
          </div>
          <div className="gray_btn">
            <i className="edit_icon" />
            <span>Edit Profile</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePictureInfos
