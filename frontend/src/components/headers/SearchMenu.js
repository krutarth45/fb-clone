import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  addToSearchHistory,
  getSearchHistory,
  removeFromSearch,
  search,
} from '../../functions/user'
import { Return, Search } from '../../svg'
import useClickOutside from '../helpers/clickOutside'

export default function SearchMenu({ color, setShowSearchMenu, token }) {
  const [iconVisible, setIconVisible] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const input = useRef(null)
  const el = useRef(null)
  useClickOutside(el, () => setShowSearchMenu(false))
  useEffect(() => {
    input.current.focus()
  }, [])
  useEffect(() => {
    getHistory()
  }, [])
  const searchHandler = async () => {
    if (searchTerm === '') {
      setResults('')
    } else {
      const res = await search(searchTerm, token)
      setResults(res)
    }
  }
  const addToSearchHistoryHandler = async (searchUser) => {
    await addToSearchHistory(searchUser, token)
    getHistory()
  }
  const getHistory = async () => {
    const res = await getSearchHistory(token)
    setSearchHistory(res)
  }
  const handleRemove = async (searchUser) => {
    const res = await removeFromSearch(searchUser, token)
    setSearchHistory(res)
  }
  console.log(results)
  return (
    <div className="header_left search_area scrollbar" ref={el}>
      <div className="search_wrap">
        <div className="header_logo">
          <div
            className="circle hover1"
            onClick={() => setShowSearchMenu(false)}
          >
            <Return color={color} />
          </div>
        </div>
        <div className="search" onClick={() => input.current.focus()}>
          {iconVisible && (
            <div>
              <Search color={color} />
            </div>
          )}
          <input
            type="text"
            placeholder="Search Facebook"
            ref={input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={searchHandler}
            onFocus={() => setIconVisible(false)}
            onBlur={() => setIconVisible(true)}
          />
        </div>
      </div>
      {results.length === 0 && (
        <div className="search_history_header">
          <span>Recent Searches</span>
          <a href="/">Edit</a>
        </div>
      )}
      <div className="search_history scrollbar">
        {searchHistory &&
          results.length === 0 &&
          searchHistory
            .sort((a, b) => {
              return new Date(b.createAt) - new Date(a.createdAt)
            })
            .map((user, index) => (
              <div className="search_user_item hover1" key={index}>
                <Link
                  className="flex"
                  to={`/profile/${user.user.username}`}
                  onClick={() => addToSearchHistoryHandler(user.user._id)}
                >
                  <img src={user.user.picture} alt="" />
                  <span>
                    {user.user.first_name} {user.user.last_name}
                  </span>
                </Link>
                <i
                  className="exit_icon"
                  onClick={() => handleRemove(user.user._id)}
                ></i>
              </div>
            ))}
      </div>
      <div className="search_results scrollbar">
        {results &&
          results.map((user, index) => (
            <Link
              to={`/profile/${user.username}`}
              key={index}
              className="search_user_item hover1"
              onClick={() => addToSearchHistoryHandler(user._id)}
            >
              <img src={user.picture} alt="" />
              <span>
                {user.first_name} {user.last_name}
              </span>
            </Link>
          ))}
      </div>
    </div>
  )
}
