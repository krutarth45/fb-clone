import { stories } from '../../../data/home'
import { ArrowRight, Plus } from '../../../svg'
import Story from './Story'
import { useMediaQuery } from 'react-responsive'
import './style.css'

function Stories() {
  const query1175px = useMediaQuery({
    query: '(max-width: 1175px)',
  })
  const query1000px = useMediaQuery({
    query: '(max-width: 1000px)',
  })
  const query960px = useMediaQuery({
    query: '(max-width: 960px)',
  })
  const query885px = useMediaQuery({
    query: '(max-width: 885px)',
  })

  const max = query885px
    ? 5
    : query960px
    ? 4
    : query1000px
    ? 5
    : query1175px
    ? 4
    : stories.length
  return (
    <div className="stories">
      <div className="create_story_card">
        <img
          src="../../../images/default_pic.png"
          alt=""
          className="create_story_img"
        />
        <div className="plus_story">
          <Plus color="#fff" />
        </div>
        <div className="story_create_text">Create Story</div>
      </div>
      {stories.slice(0, max).map((element, index) => (
        <Story
          key={index}
          img={element.image}
          proPic={element.profile_picture}
          proName={element.profile_name}
        />
      ))}
      <div className="white_circle">
        <ArrowRight color="#65676b" />
      </div>
    </div>
  )
}

export default Stories
