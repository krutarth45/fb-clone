import { useEffect, useRef, useState } from 'react'
import Picker from 'emoji-picker-react'
import { comment } from '../../functions/post'
import dataURItoBlob from '../helpers/dataURItoBlob'
import { uploadImages } from '../../functions/uploadImages'
import ClipLoader from 'react-spinners/ClipLoader'
const CreateComment = ({ user, postId, setComments, setCount }) => {
  const [picker, setPicker] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [commentImage, setCommentImage] = useState(null)
  const [cursorPosition, setCursorPosition] = useState(0)
  const textRef = useRef(null)
  const imgInput = useRef(null)
  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition
  }, [cursorPosition])
  const handleEmoji = (e, { emoji }) => {
    const ref = textRef.current
    ref.focus()
    const start = text.substring(0, ref.selectionStart)
    const end = text.substring(ref.selectionStart)
    const newText = start + emoji + end
    setText(newText)
    setCursorPosition(start.length + emoji.length)
  }
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
    } else if (file.size > 1024 * 1024 * 2) {
      setError(`${file.name} Size should be less than 2 mb.`)
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      setCommentImage(event.target.result)
    }
  }
  const handleComment = async (e) => {
    if (e.key === 'Enter') {
      if (commentImage) {
        setLoading(true)
        const img = dataURItoBlob(commentImage)
        const path = `${user.username}/postImages/${postId}`
        let formData = new FormData()
        formData.append('path', path)
        formData.append('file', img)
        const imgComment = await uploadImages(formData, path, user.token)
        const comments = await comment(
          text,
          imgComment[0].url,
          postId,
          user.token,
        )
        setComments(comments)
        setCount((prev) => prev + 1)
        setLoading(false)
        setText('')
        setCommentImage('')
      } else {
        setLoading(true)
        const comments = await comment(text, '', postId, user.token)
        setComments(comments)
        setCount((prev) => prev + 1)
        setLoading(false)
        setText('')
        setCommentImage('')
      }
    }
  }
  return (
    <div className="create_comment_wrap">
      <div className="create_comment">
        <img src={user?.picture} alt="" />
        <div className="comment_input_wrap">
          {picker && (
            <div className="comment_emoji_picker">
              <Picker onEmojiClick={handleEmoji} />
            </div>
          )}
          <input
            type="file"
            hidden
            ref={imgInput}
            accept="image/jpeg,image/jpg,image/png,image/gif"
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
          <input
            type="text"
            ref={textRef}
            value={text}
            placeholder="Write a comment..."
            onChange={(e) => setText(e.target.value)}
            onKeyUp={handleComment}
          />
          <div className="comment_circle">
            <ClipLoader
              size={20}
              // style={{ marginTop: '5px' }}
              color="#1876f2"
              loading={loading}
            />
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => setPicker((prev) => !prev)}
          >
            <i className="emoji_icon"></i>
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => imgInput.current.click()}
          >
            <i className="camera_icon"></i>
          </div>
          <div className="comment_circle_icon hover2">
            <i className="gif_icon"></i>
          </div>
          <div className="comment_circle_icon hover2">
            <i className="sticker_icon"></i>
          </div>
        </div>
      </div>
      {commentImage && (
        <div className="comment_img_preview">
          <img src={commentImage} alt="" />
          <div
            className="small_white_circle"
            onClick={() => setCommentImage(null)}
          >
            <i className="exit_icon"></i>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateComment
