import { useRef } from 'react'
import useClickOutside from '../../components/helpers/clickOutside'
const OldCovers = ({ photos, user, setCoverPicture, setShow }) => {
  const selRef = useRef(null)
  useClickOutside(selRef, () => setShow(false))
  return (
    <div className="blur">
      <div className="postBox selectCoverBox" ref={selRef}>
        <div className="box_header">
          <div className="small_circle" onClick={() => setShow(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Select Photo</span>
        </div>
        <div className="selectCoverBox_links">
          <div className="selectCoverBox_link">Recent Photos</div>
          <div className="selectCoverBox_link">Photo Albums</div>
        </div>
        <div className="old_pictures_wrap scrollbar">
          <h4>Your Cover Pictures</h4>
          <div className="old_pictures">
            {photos
              .filter((img) => img.folder === `${user.username}/cover_pictures`)
              .map((photo) => (
                <img
                  src={photo.secure_url}
                  key={photo.public_id}
                  alt=""
                  onClick={() => {
                    setShow(false)
                    setCoverPicture(photo.secure_url)
                  }}
                />
              ))}
          </div>
          <h4>Your Other Pictures</h4>
          <div className="old_pictures">
            {photos
              .filter((img) => img.folder !== `${user.username}/cover_pictures`)
              .map((photo) => (
                <img
                  src={photo.secure_url}
                  key={photo.public_id}
                  alt=""
                  onClick={() => {
                    setShow(false)
                    setCoverPicture(photo.secure_url)
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OldCovers
