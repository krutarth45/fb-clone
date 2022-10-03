import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import CreatePost from '../../components/createPost'
import Header from '../../components/headers'
import LeftHome from '../../components/home/left'
import RightHome from '../../components/home/right'
import Stories from '../../components/home/stories'
import ActivateForm from './ActivateForm'
import './style.css'

function Activate() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => ({ ...state }))
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { token } = useParams()
  const activateAccount = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/activate`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      )
      Cookies.set('user', JSON.stringify({ ...user, verified: true }))
      dispatch({ type: 'VERIFY', payload: true })
      setSuccess(data.message)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      setError(error.response.data.message)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    }
  }
  useEffect(() => {
    activateAccount()
  }, [])
  return (
    <div className="home">
      {success && (
        <ActivateForm
          type="success"
          header="Account Verification Success"
          text={success}
          loading={loading}
        />
      )}
      {error && (
        <ActivateForm
          type="error"
          header="Account Verification Failed"
          text={error}
          loading={loading}
        />
      )}
      <Header />
      <LeftHome user={user} />
      <div className="home_middle">
        <Stories />
        <CreatePost user={user} />
      </div>
      <RightHome user={user} />
    </div>
  )
}

export default Activate
