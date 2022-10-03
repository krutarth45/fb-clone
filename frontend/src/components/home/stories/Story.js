function Story({ img, proName, proPic }) {
  return (
    <div className="story">
      <img src={img} alt="" className="story_img" />
      <div className="story_profile_pic">
        <img src={proPic} alt="" />
      </div>
      <div className="story_profile_name">{proName}</div>
    </div>
  )
}

export default Story
