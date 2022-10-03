import axios from 'axios'
import { useEffect, useReducer, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/headers'
import { profileReducer } from '../../functions/reducers'
import Cover from './cover'
import PplYouMayKnow from './pplYouMayKnow'
import ProfileMenu from './profileMenu'
import CreatePost from '../../components/createPost/index'
import ProfilePictureInfos from './profilePictureInfos'
import './style.css'
import GridPosts from './gridPosts'
import Post from '../../components/post'
import Photos from './photos'
import Friends from './friends'
import Intro from '../../components/intro'
import { useMediaQuery } from 'react-responsive'
import CreatePostPopup from '../../components/createPostPopup'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { ClipLoader } from 'react-spinners'

export default function Profile({ getAllPosts }) {
  const [visible, setVisible] = useState(false)
  const { username } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => ({ ...state }))
  const [photos, setPhotos] = useState({})
  const [othername, setOthername] = useState(null)
  var userName = username === undefined ? user.username : username
  const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
    loading: false,
    profile: [],
    error: '',
  })
  useEffect(() => {
    getProfile()
  }, [userName, profile?.posts?.length])
  useEffect(() => {
    setOthername(profile?.details?.othername)
  }, [profile])
  const getProfile = async () => {
    try {
      dispatch({
        type: 'PROFILE_REQUEST',
      })
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getprofile/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      if (data.ok === false) {
        navigate('/profile')
      } else {
        const images = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/listimages`,
          {
            path: `${userName}/*`,
            sort: 'desc',
            max: 30,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        setPhotos(images.data)
        dispatch({
          type: 'PROFILE_SUCCESS',
          payload: data,
        })
      }
    } catch (error) {
      dispatch({
        type: 'PROFILE_ERROR',
        payload: error.response.data.message,
      })
    }
  }
  var visitor = userName === user.username ? false : true
  const check = useMediaQuery({
    query: '(min-width: 901px)',
  })
  const profileTop = useRef(null)
  const leftSide = useRef(null)
  const [height, setHeight] = useState(null)
  const [leftHeight, setLeftHeight] = useState(null)
  const [scrollHeight, setScrollHeight] = useState(null)
  useEffect(() => {
    setHeight(profileTop.current.clientHeight + 300)
    setLeftHeight(leftSide.current.clientHeight)
    window.addEventListener('scroll', getScroll, { passive: true })
    return () => {
      window.addEventListener('scroll', getScroll, { passive: true })
    }
  }, [loading])
  const getScroll = () => {
    setScrollHeight(window.pageYOffset)
  }
  return (
    <div className="profile">
      {visible && (
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          posts={profile?.posts}
          dispatch={dispatch}
          profile
        />
      )}
      <Header page="profile" getAllPosts={getAllPosts} />
      <div className="profile_top" ref={profileTop}>
        <div className="profile_container">
          {loading ? (
            <>
              <div className="profile_cover">
                <Skeleton
                  height="347px"
                  containerClassName="avatar-skeleton"
                  style={{ borderRadius: '8px' }}
                />
              </div>
              <div
                className="profile_img_wrap"
                style={{
                  marginBottom: '-3rem',
                  transform: 'translateY(-8px)',
                }}
              >
                <div className="profile_w_left">
                  <Skeleton
                    circle
                    height="180px"
                    width="180px"
                    containerClassName="avatar-skeleton"
                    style={{ transform: 'translateY(-3.3rem)' }}
                  />
                  <div className="profile_w_col">
                    <div className="profile_name">
                      <Skeleton
                        height="35px"
                        width="200px"
                        containerClassName="avatar-skeleton"
                      />
                      <Skeleton
                        height="30px"
                        width="100px"
                        containerClassName="avatar-skeleton"
                        style={{ transform: 'translateY(2.5px)' }}
                      />
                    </div>
                    <div className="profile_friend_count">
                      <Skeleton
                        height="20px"
                        width="90px"
                        containerClassName="avatar-skeleton"
                        style={{ marginTop: '5px' }}
                      />
                    </div>
                    <div className="profile_friend_imgs">
                      {Array.from(new Array(6), (val, i) => i + 1).map(
                        (id, i) => (
                          <Skeleton
                            circle
                            height="32px"
                            width="32px"
                            containerClassName="avatar-skeleton"
                            style={{ transform: `translateX(${-i * 7}px)` }}
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <div className={`friendship ${!visitor && 'fix'}`}>
                  <Skeleton
                    height="36px"
                    width={120}
                    containerClassName="avatar-skeleton"
                  />
                  <div className="flex">
                    <Skeleton
                      height="36px"
                      width={120}
                      containerClassName="avatar-skeleton"
                    />
                    {visitor && (
                      <Skeleton
                        height="36px"
                        width={120}
                        containerClassName="avatar-skeleton"
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Cover
                cover={profile.cover}
                visitor={visitor}
                photos={photos.resources}
              />
              <ProfilePictureInfos
                profile={profile}
                visitor={visitor}
                photos={photos.resources}
                othername={othername}
              />
            </>
          )}
          <ProfileMenu />
        </div>
      </div>
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            <PplYouMayKnow />
            <div
              className={`profile_grid ${
                check && scrollHeight >= height && leftHeight > 1000
                  ? 'scrollFixed showLess'
                  : check &&
                    scrollHeight >= height &&
                    leftHeight < 1000 &&
                    'scrollFixed showMore'
              }`}
            >
              <div className="profile_left" ref={leftSide}>
                {loading ? (
                  <>
                    <div className="profile_card">
                      <div className="profile_card_header">Intro</div>
                      <div className="skeleton_loader">
                        <ClipLoader size={85} color="#1876f2" />
                      </div>
                    </div>
                    <div className="profile_card">
                      <div className="profile_card_header">
                        Photos
                        <div className="profile_header_link">
                          See all photos
                        </div>
                      </div>
                      <div className="skeleton_loader">
                        <ClipLoader size={85} color="#1876f2" />
                      </div>
                    </div>
                    <div className="profile_card">
                      <div className="profile_card_header">
                        Friends
                        <div className="profile_header_link">
                          See all friends
                        </div>
                      </div>
                      <div className="skeleton_loader">
                        <ClipLoader size={85} color="#1876f2" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Intro
                      detailss={profile.details}
                      visitor={visitor}
                      setOthername={setOthername}
                    />
                    <Photos
                      username={userName}
                      token={user.token}
                      photos={photos}
                    />
                    <Friends friends={profile?.friends} />
                  </>
                )}
                <div className="relative_fb_copyright">
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
              <div className="profile_right">
                {!visitor && (
                  <CreatePost user={user} profile setVisible={setVisible} />
                )}
                <GridPosts />
                {loading ? (
                  <div className="skeleton_loader">
                    <ClipLoader size={85} color="#1876f2" />
                  </div>
                ) : (
                  <div className="posts">
                    {profile.posts && profile.posts.length ? (
                      profile.posts.map((post, index) => (
                        <Post
                          post={post}
                          user={user}
                          key={index}
                          dispatchProfile={dispatch}
                          profile
                        />
                      ))
                    ) : (
                      <div className="no_posts">No Post Available</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
