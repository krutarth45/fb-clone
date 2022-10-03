import { useEffect, useRef, useState } from 'react'
import Picker from 'emoji-picker-react'
import { useMediaQuery } from 'react-responsive'

function EmojiPickerBackgrounds({
  text,
  setText,
  user,
  type2,
  setBackground,
  background,
}) {
  const [picker, setPicker] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [showBgs, setShowBgs] = useState(false)
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
  const textRef = useRef(null)
  const bgRef = useRef(null)
  const postBackgrounds = [
    '../../images/postbackgrounds/1.jpg',
    '../../images/postbackgrounds/2.jpg',
    '../../images/postbackgrounds/3.jpg',
    '../../images/postbackgrounds/4.jpg',
    '../../images/postbackgrounds/5.jpg',
    '../../images/postbackgrounds/6.jpg',
    '../../images/postbackgrounds/7.jpg',
    '../../images/postbackgrounds/8.jpg',
    '../../images/postbackgrounds/9.jpg',
  ]
  const backgroundHandler = (i) => {
    bgRef.current.style.backgroundImage = `url(${postBackgrounds[i]})`
    setBackground(postBackgrounds[i])
    bgRef.current.classList.add('bgHandler')
  }
  const removeBackground = (i) => {
    bgRef.current.style.backgroundImage = ''
    setBackground('')
    bgRef.current.classList.remove('bgHandler')
  }
  const sm = useMediaQuery({
    query: '(max-width: 550px)',
  })
  return (
    <div className={type2 ? 'images_input' : ''}>
      <div className={!type2 ? 'flex_center' : ''} ref={bgRef}>
        <textarea
          maxLength="200"
          ref={textRef}
          value={text}
          className={`post_input ${type2 && 'input2'} ${
            sm && !background && 'l0'
          }`}
          placeholder={`What's on your mind, ${user?.first_name}`}
          onChange={(e) => setText(e.target.value)}
          style={{
            paddingTop: `${
              background
                ? Math.abs(textRef.current.value.length * 0.1 - 30)
                : '0'
            }%`,
          }}
        ></textarea>
      </div>
      <div className={!type2 ? 'post_emojis_wrap' : ''}>
        {picker && (
          <div
            className={`comment_emoji_picker ${
              type2 ? 'movepicker2' : 'rlmove'
            }`}
          >
            <Picker onEmojiClick={handleEmoji} />
          </div>
        )}
        {!type2 && (
          <img
            src="../../../icons/colorful.png"
            alt=""
            onClick={() => setShowBgs((prev) => !prev)}
          />
        )}
        {!type2 && showBgs && (
          <div className="post_backgrounds">
            <div className="no_bg" onClick={() => removeBackground()}></div>
            {postBackgrounds.map((bg, i) => (
              <img
                src={bg}
                key={i}
                alt=""
                onClick={() => backgroundHandler(i)}
              />
            ))}
          </div>
        )}
        <i
          className={`emoji_icon_large ${type2 && 'moveleft'}`}
          onClick={() => setPicker((prev) => !prev)}
        ></i>
      </div>
    </div>
  )
}

export default EmojiPickerBackgrounds
