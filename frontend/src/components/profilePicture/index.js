import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import useClickOutside from '../helpers/clickOutside'
import './style.css'
import UpdateProfilePicture from './updateProfilePicture'

const ProfilePicture = ({ setShow, pRef, photos }) => {
  const { user } = useSelector((state) => ({ ...state }))
  const refInput = useRef(null)
  const wholeEl = useRef(null)
  useClickOutside(wholeEl, () => setShow(false))
  const [image, setImage] = useState('')
  const [error, setError] = useState('')
  const handleImage = (e) => {
    let file = e.target.files[0]
    if (
      file.type !== 'image/jpg' &&
      file.type !== 'image/jpeg' &&
      file.type !== 'image/png' &&
      file.type !== 'image/webp'
    ) {
      setError(`${file.name} Format Unsupported`)
      return
    } else if (file.size > 1024 * 1024 * 5) {
      setError(`${file.name} Size should be less than 2 mb.`)
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      e.target.value = null
      setImage(event.target.result)
    }
  }
  return (
    <div className="blur">
      <input
        type="file"
        ref={refInput}
        hidden
        onChange={handleImage}
        accept="image/jpeg,image/jpg,image/png,image/gif"
      />
      <div className="postBox pictureBox" ref={wholeEl}>
        <div className="box_header">
          <div
            className="small_circle"
            onClick={() => {
              setShow(false)
            }}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Update Profile Picture</span>
        </div>
        <div className="update_picture_wrap">
          <div className="update_picture_buttons">
            <button
              className="light_blue_btn"
              onClick={() => refInput.current.click()}
            >
              <i className="plus_icon"></i>
              Upload Photo
            </button>
            <button className="gray_btn">
              <i className="frame_icon"></i>
              Add Frame
            </button>
          </div>
        </div>
        {error && (
          <div className="postError comment_error">
            <div className="postError_error">{error}</div>
            <button className="blue_btn" onClick={() => setError('')}>
              Try Again
            </button>
          </div>
        )}
        <div className="old_pictures_wrap scrollbar">
          <h4>Your Profile Pictures</h4>
          <div className="old_pictures">
            {photos
              .filter(
                (img) => img.folder === `${user.username}/profile_pictures`,
              )
              .map((photo) => (
                <img
                  src={photo.secure_url}
                  key={photo.public_id}
                  alt=""
                  onClick={() => setImage(photo.secure_url)}
                />
              ))}
          </div>
          <h4>Your Other Pictures</h4>
          <div className="old_pictures">
            {photos
              .filter(
                (img) => img.folder !== `${user.username}/profile_pictures`,
              )
              .map((photo) => (
                <img
                  src={photo.secure_url}
                  key={photo.public_id}
                  alt=""
                  onClick={() => setImage(photo.secure_url)}
                />
              ))}
          </div>
        </div>
        {image && (
          <UpdateProfilePicture
            image={image}
            setImage={setImage}
            setError={setError}
            setShow={setShow}
            pRef={pRef}
          />
        )}
      </div>
    </div>
  )
}

export default ProfilePicture
