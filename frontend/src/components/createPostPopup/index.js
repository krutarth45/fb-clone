import './style.css'
import { useRef, useState } from 'react'
import EmojiPickerBackgrounds from './emojiPickerBackgrounds'
import AddToYourPost from './addToYourPost'
import ImagePreview from './imagePreview'
import PulseLoader from 'react-spinners/PulseLoader'
import useClickOutside from '../helpers/clickOutside'
import { createPost } from '../../functions/post'
import PostError from './postError'
import dataURItoBlob from '../helpers/dataURItoBlob'
import { uploadImages } from '../../functions/uploadImages'

function CreatePostPopup({ user, setVisible, posts, dispatch, profile }) {
  const popup = useRef(null)
  const [text, setText] = useState('')
  const [showPrev, setShowPrev] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState([])
  const [background, setBackground] = useState('')
  useClickOutside(popup, () => {
    setVisible(false)
  })
  const postSubmit = async () => {
    if (background) {
      setLoading(true)
      const response = await createPost(
        null,
        background,
        text,
        null,
        user._id,
        user.token,
      )
      setLoading(false)
      if (response.status === 'ok') {
        dispatch({
          type: profile ? 'PROFILE_POSTS' : 'POSTS_SUCCESS',
          payload: [response.data, ...posts],
        })
        setBackground('')
        setText('')
        setVisible(false)
      } else {
        setError(response)
      }
    } else if (images && images.length) {
      setLoading(true)
      const postImages = images.map((img) => dataURItoBlob(img))
      const path = `${user.username}/postImages`
      let formData = new FormData()
      formData.append('path', path)
      postImages.forEach((element) => {
        formData.append('file', element)
      })
      const response = await uploadImages(formData, path, user.token)
      const res = await createPost(
        null,
        null,
        text,
        response,
        user._id,
        user.token,
      )
      setLoading(false)
      if (res.status === 'ok') {
        dispatch({
          type: profile ? 'PROFILE_POSTS' : 'POSTS_SUCCESS',
          payload: [res.data, ...posts],
        })
        setImages([])
        setText('')
        setVisible(false)
      } else {
        setError(response)
      }
    } else if (text) {
      setLoading(true)
      const response = await createPost(
        null,
        null,
        text,
        null,
        user._id,
        user.token,
      )
      setLoading(false)
      if (response.status === 'ok') {
        dispatch({
          type: profile ? 'PROFILE_POSTS' : 'POSTS_SUCCESS',
          payload: [response.data, ...posts],
        })
        setBackground('')
        setText('')
        setVisible(false)
      } else {
        setError(response)
      }
    } else {
      console.log('Nothing')
    }
  }
  return (
    <div className="blur">
      <div className="postBox" ref={popup}>
        {error && <PostError error={error} setError={setError} />}
        <div className="box_header">
          <div
            className="small_circle hover3"
            onClick={() => setVisible(false)}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>
        <div className="box_profile">
          <img src={user?.picture} alt="" className="box_profile_img" />
          <div className="box_col">
            <div className="box_profile_name">
              {user.first_name} {user.last_name}
            </div>
            <div className="box_privacy">
              <img src="../../../icons/public.png" alt="" />
              <span>Public</span>
              <i className="arrowDown_icon"></i>
            </div>
          </div>
        </div>
        {!showPrev ? (
          <EmojiPickerBackgrounds
            text={text}
            setText={setText}
            user={user}
            setBackground={setBackground}
            background={background}
          />
        ) : (
          <ImagePreview
            text={text}
            setText={setText}
            user={user}
            images={images}
            setImages={setImages}
            setShowPrev={setShowPrev}
            setError={setError}
          />
        )}
        <AddToYourPost setShowPrev={setShowPrev} />
        <button
          className="post_submit"
          type="submit"
          onClick={() => postSubmit()}
          disabled={loading}
        >
          {loading ? <PulseLoader color="#fff" size={5} /> : 'POST'}
        </button>
      </div>
    </div>
  )
}

export default CreatePostPopup
