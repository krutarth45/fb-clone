import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import CreatePost from '../../components/createPost'
import Header from '../../components/headers'
import LeftHome from '../../components/home/left'
import RightHome from '../../components/home/right'
import SendVerification from '../../components/home/sendVerification'
import Stories from '../../components/home/stories'
import Post from '../../components/post'
import './style.css'
export default function Home({ setVisible, posts, getAllPosts, dispatchApp }) {
  const { user } = useSelector((state) => ({ ...state }))
  const middle = useRef(null)
  const [height, setHeight] = useState()
  useEffect(() => {
    getAllPosts()
    setHeight(middle.current.clientHeight)
  }, [posts?.length, height])
  console.log(posts)
  return (
    <div className="home" style={{ height: `${height + 150}px` }}>
      <Header page="home" getAllPosts={getAllPosts} />
      <LeftHome user={user} />
      <div className="home_middle" ref={middle}>
        <Stories />
        {user.verified === false && <SendVerification user={user} />}
        <CreatePost user={user} setVisible={setVisible} />
        {/* {posts ? (
          <div className="skeleton_loader">
            <ClipLoader size={85} color="#1876f2" />
          </div>
        ) : (
          <div className="posts">
            {posts.map((post, index) => (
              <Post
                key={index}
                post={post}
                user={user}
                dispatchApp={dispatchApp}
              />
            ))}
          </div>
        )} */}
        <div className="posts">
          {posts.map((post, index) => (
            <Post
              key={index}
              post={post}
              user={user}
              dispatchApp={dispatchApp}
            />
          ))}
        </div>
      </div>
      <RightHome user={user} />
    </div>
  )
}
