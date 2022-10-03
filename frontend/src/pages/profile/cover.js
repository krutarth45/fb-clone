import { useCallback, useEffect, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../../components/helpers/getCroppedImg'
import { useDispatch, useSelector } from 'react-redux'
import { uploadImages } from '../../functions/uploadImages'
import { updateCover } from '../../functions/user'
import { createPost } from '../../functions/post'
import Cookies from 'js-cookie'
import PulseLoader from 'react-spinners/PulseLoader'
import OldCovers from './oldCovers'
import useClickOutside from '../../components/helpers/clickOutside'

const Cover = ({ cover, visitor, photos }) => {
  const [showCoverMenu, setShowCoverMenu] = useState(false)
  const [coverPicture, setCoverPicture] = useState(null)
  const [width, setWidth] = useState(null)
  const [error, setError] = useState('')
  const menu = useRef(null)
  const refInput = useRef(null)
  const coverRef = useRef(null)
  const coverImgRef = useRef(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => ({ ...state }))
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  useClickOutside(menu, () => setShowCoverMenu(false))
  useEffect(() => {
    setWidth(coverRef.current.clientWidth)
  }, [window.innerWidth])
  const handleImage = (e) => {
    let file = e.target.files[0]
    if (
      file.type !== 'image/jpg' &&
      file.type !== 'image/jpeg' &&
      file.type !== 'image/png' &&
      file.type !== 'image/webp'
    ) {
      setError(`${file.name} Format Unsupported`)
      setShowCoverMenu(false)
      e.target.value = null
      return
    } else if (file.size > 1024 * 1024 * 5) {
      setError(`${file.name} Size should be less than 2 mb.`)
      setShowCoverMenu(false)
      e.target.value = null
      return
    }
    setShowCoverMenu(false)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      e.target.value = null
      setCoverPicture(event.target.result)
    }
  }
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])
  const getCroppedImage = useCallback(
    async (show) => {
      try {
        const img = await getCroppedImg(coverPicture, croppedAreaPixels)
        if (show) {
          setZoom(1)
          setCrop({ x: 0, y: 0 })
          setCoverPicture(img)
        } else {
          return img
        }
      } catch (error) {
        console.log(error)
      }
    },
    [croppedAreaPixels],
  )
  const updateCoverPicture = async () => {
    try {
      setLoading(true)
      let img = await getCroppedImage()
      let blob = await fetch(img).then((b) => b.blob())
      const path = `${user.username}/cover_pictures`
      let formData = new FormData()
      formData.append('file', blob)
      formData.append('path', path)
      const res = await uploadImages(formData, path, user.token)
      const updated_picture = await updateCover(res[0].url, user.token)
      if (updated_picture === 'ok') {
        const new_post = await createPost(
          'cover',
          null,
          null,
          res,
          user._id,
          user.token,
        )
        if (new_post === 'ok') {
          setLoading(false)
          setCoverPicture('')
          coverImgRef.current.src = res[0].url
          Cookies.set(
            'user',
            JSON.stringify({
              ...user,
              cover: res[0].url,
            }),
          )
          dispatch({ type: 'UPDATECOVER', payload: res[0].url })
        } else {
          setLoading(false)
          setError(new_post)
        }
      } else {
        setLoading(false)
        setError(updated_picture)
      }
    } catch (error) {
      setLoading(false)
      setError(error.response.data.message)
    }
  }
  return (
    <div className="profile_cover" ref={coverRef}>
      {coverPicture && (
        <div className="save_changes_cover">
          <div className="save_changes_left">
            <i className="public_icon"></i>
            Your Cover Photo is Public.
          </div>
          <div className="save_changes_right">
            <button
              className="blue_btn opacity_btn"
              onClick={() => setCoverPicture('')}
            >
              Cancel
            </button>
            <button className="blue_btn" onClick={() => updateCoverPicture()}>
              {loading ? <PulseLoader color="#fff" size={5} /> : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={refInput}
        hidden
        accept="image/jpg,image/png,image/webp/image/gif,image/jpeg"
        onChange={handleImage}
      />
      {error && (
        <div className="postError comment_error">
          <div className="postError_error">{error}</div>
          <button className="blue_btn" onClick={() => setError('')}>
            Try Again
          </button>
        </div>
      )}
      {coverPicture && (
        <div className="cover_crooper">
          <Cropper
            image={coverPicture}
            crop={crop}
            zoom={zoom}
            aspect={width / 350}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={true}
            objectFit="horizontal-cover"
          />
        </div>
      )}
      {cover && !coverPicture && (
        <img src={cover} className="cover" ref={coverImgRef} />
      )}
      {!visitor && (
        <div className="update_cover_wrapper">
          <div
            className="open_cover_update"
            onClick={() => setShowCoverMenu(true)}
          >
            <i className="camera_filled_icon"></i>
            Add Cover Photo.
          </div>
          {showCoverMenu && (
            <div className="open_cover_menu" ref={menu}>
              <div
                className="open_cover_menu_item hover1"
                onClick={() => setShow(true)}
              >
                <i className="photo_icon"></i>
                Select Photo
              </div>
              <div
                className="open_cover_menu_item hover1"
                onClick={() => refInput.current.click()}
              >
                <i className="upload_icon"></i>
                Upload Photo
              </div>
            </div>
          )}
        </div>
      )}
      {show && photos && (
        <OldCovers
          photos={photos}
          user={user}
          setCoverPicture={setCoverPicture}
          setShow={setShow}
        />
      )}
    </div>
  )
}

export default Cover
