import { Link } from 'react-router-dom'

const Friends = ({ friends }) => {
  return (
    <div className="profile_card">
      <div className="profile_card_header">
        Friends
        <div className="profile_header_link">See all friends</div>
      </div>
      {friends && (
        <div className="profile_card_count">
          {friends.length === 0
            ? ''
            : friends.length === 1
            ? '1 Friend'
            : `${friends.length} Friends`}
        </div>
      )}
      <div className="profile_card_grid">
        {friends &&
          friends.slice(0, 9).map((friend, index) => (
            <Link
              to={`/profile/${friend.username}`}
              className="profile_photo_card"
              key={index}
            >
              <img src={friend.picture} key={index} alt="" />
              <div className="profile_photo_card_span">
                <span>
                  {friend.first_name} {friend.last_name}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default Friends
