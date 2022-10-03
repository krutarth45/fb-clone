import { useEffect, useRef, useState } from 'react'
import useClickOutside from '../../components/helpers/clickOutside'
import { useSelector } from 'react-redux'
import {
  acceptRequest,
  addFriend,
  cancelRequest,
  deleteRequest,
  follow,
  unfollow,
  unfriend,
} from '../../functions/user'
const Friendship = ({ friendshipp, profileid }) => {
  const { user } = useSelector((state) => ({ ...state }))
  const [friendsMenu, setFriendsMenu] = useState(false)
  const [respondMenu, setRespondMenu] = useState(false)
  const [friendship, setFriendship] = useState(friendshipp)
  const popup1 = useRef(null)
  const popup2 = useRef(null)
  useClickOutside(popup1, () => setFriendsMenu(false))
  useClickOutside(popup2, () => setRespondMenu(false))
  useEffect(() => {
    setFriendship(friendshipp)
  }, [friendshipp])
  const addFriendHandler = async () => {
    await addFriend(profileid, user.token)
    setFriendship({ ...friendship, requestSent: true, following: true })
  }
  const cancelRequestHandler = async () => {
    await cancelRequest(profileid, user.token)
    setFriendship({ ...friendship, requestSent: false, following: false })
  }
  const followHandler = async () => {
    await follow(profileid, user.token)
    setFriendship({ ...friendship, following: true })
  }
  const unfollowHandler = async () => {
    await unfollow(profileid, user.token)
    setFriendship({ ...friendship, following: false })
  }
  const acceptRequestHandler = async () => {
    await acceptRequest(profileid, user.token)
    setFriendship({
      friends: true,
      following: true,
      requestSent: false,
      requestReceived: false,
    })
  }
  const deleteRequestHandler = async () => {
    await deleteRequest(profileid, user.token)
    setFriendship({
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    })
  }
  const unfriendHandler = async () => {
    await unfriend(profileid, user.token)
    setFriendship({
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    })
  }
  return (
    <div className="friendship">
      {friendship?.friends ? (
        <div className="friends_menu_wrap">
          <button className="gray_btn" onClick={() => setFriendsMenu(true)}>
            <img src="../../../icons/friends.png" alt="" />
            <span>Friends</span>
          </button>
          {friendsMenu && (
            <div className="open_cover_menu" ref={popup1}>
              <div className="open_cover_menu_item hover1">
                <img src="../../../icons/favoritesOutline.png" alt="" />
                Favorites
              </div>
              <div className="open_cover_menu_item hover1">
                <img src="../../../icons/editFriends.png" alt="" />
                Edit Friends List
              </div>
              {friendship?.following ? (
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => unfollowHandler()}
                >
                  <img src="../../../icons/unfollowOutlined.png" alt="" />
                  Unfollow
                </div>
              ) : (
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => followHandler()}
                >
                  <img src="../../../icons/unfollowOutlined.png" alt="" />
                  Follow
                </div>
              )}
              <div
                className="open_cover_menu_item hover1"
                onClick={() => unfriendHandler()}
              >
                <i className="unfriend_outlined_icon"></i>
                Unfriend
              </div>
            </div>
          )}
        </div>
      ) : (
        !friendship?.requestSent &&
        !friendship?.requestReceived && (
          <button className="blue_btn" onClick={() => addFriendHandler()}>
            <img src="../../../icons/addFriend.png" className="invert" alt="" />
            <span>Add Friend</span>
          </button>
        )
      )}
      {friendship?.requestSent ? (
        <button className="blue_btn" onClick={() => cancelRequestHandler()}>
          <img
            src="../../../icons/cancelRequest.png"
            className="invert"
            alt=""
          />
          <span>Cancel Request</span>
        </button>
      ) : (
        friendship?.requestReceived && (
          <div className="friends_menu_wrap">
            <button className="gray_btn" onClick={() => setRespondMenu(true)}>
              <img src="../../../icons/friends.png" alt="" />
              <span>Respond</span>
            </button>
            {respondMenu && (
              <div className="open_cover_menu" ref={popup2}>
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => acceptRequestHandler()}
                >
                  Confirm
                </div>
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => deleteRequestHandler()}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        )
      )}
      <div className="flex">
        {friendship?.following ? (
          <button className="gray_btn" onClick={() => unfollowHandler()}>
            <img src="../../../icons/follow.png" alt="" />
            <span>Following</span>
          </button>
        ) : (
          <button className="blue_btn" onClick={() => followHandler()}>
            <img src="../../../icons/follow.png" className="invert" alt="" />
            <span>Follow</span>
          </button>
        )}
        <button className={friendship?.friends ? 'blue_btn' : 'gray_btn'}>
          <img
            src="../../../icons/message.png"
            className={friendship?.friends ? 'invert' : ''}
            alt=""
          />
          <span>Message</span>
        </button>
      </div>
    </div>
  )
}

export default Friendship
