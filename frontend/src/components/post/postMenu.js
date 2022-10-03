import { useRef } from 'react'
import MenuItem from './menuItem'
import useClickOutside from '../helpers/clickOutside'
import { deletePost, savePost } from '../../functions/post'
import { saveAs } from 'file-saver'
const PostMenu = ({
  userId,
  postUserId,
  imagesLength,
  setShowMenu,
  postId,
  token,
  checkSaved,
  setCheckSaved,
  images,
  profile,
  dispatchProfile,
  dispatchApp,
}) => {
  let test = postUserId === userId ? true : false
  const menu = useRef(null)
  useClickOutside(menu, () => setShowMenu(false))
  const saveHandler = async () => {
    await savePost(postId, token)
    setCheckSaved((prev) => !prev)
  }
  const deleteHandler = async () => {
    await deletePost(postId, token)
    if (profile) {
      dispatchProfile({ type: 'PROFILE_POST_REMOVE', payload: postId })
    } else {
      dispatchApp({ type: 'POSTS_REMOVE_ONE', payload: postId })
    }
  }
  const downloadImages = async () => {
    images.map((img) => {
      saveAs(img.url, 'image.jpg')
    })
  }
  return (
    <ul className="post_menu" ref={menu}>
      {test && <MenuItem icon="pin_icon" title="Pin Post" />}
      <div onClick={() => saveHandler()}>
        <MenuItem
          icon="save_icon"
          title={checkSaved ? 'Unsave Post' : 'Save Post'}
          subtitle={
            checkSaved
              ? 'Remove this post from your Saved items.'
              : 'Add this to your Saved items.'
          }
        />
      </div>
      <div className="line"></div>
      {test && <MenuItem icon="edit_icon" title="Edit Post" />}
      {!test && (
        <MenuItem
          icon="turnOnNotification_icon"
          title="Turn on notifications for this post"
        />
      )}
      {imagesLength && (
        <div onClick={() => downloadImages()}>
          <MenuItem icon="download_icon" title="Download" />
        </div>
      )}
      {imagesLength && (
        <MenuItem icon="fullscreen_icon" title="Enter Fullscreen" />
      )}
      {test && (
        <MenuItem img="../../../public/icons/lock.png" title="Edit audience" />
      )}
      {test && (
        <MenuItem
          icon="turnOffNotifications_icon"
          title="Turn off notifications for this post"
        />
      )}
      {test && <MenuItem icon="delete_icon" title="Turn off translations" />}
      {test && <MenuItem icon="date_icon" title="Edit Date" />}
      {test && (
        <MenuItem icon="refresh_icon" title="Refresh share attachment" />
      )}
      {test && <MenuItem icon="archive_icon" title="Move to archive" />}
      {test && (
        <div onClick={() => deleteHandler()}>
          <MenuItem
            icon="trash_icon"
            title="Move to trash"
            subtitle="items in your trash are deleted after 30 days"
          />
        </div>
      )}
      {!test && <div className="line"></div>}
      {!test && (
        <MenuItem
          img="../../../icons/report.png"
          title="Report post"
          subtitle="i'm concerned about this post"
        />
      )}
    </ul>
  )
}

export default PostMenu
