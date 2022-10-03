import { useRef } from 'react'
import Detail from './detail'
import useClickOutside from '../helpers/clickOutside'

const EditDetails = ({
  details,
  handleChange,
  updateDetails,
  infos,
  setVisible,
}) => {
  const modal = useRef(null)
  useClickOutside(modal, () => setVisible(false))
  return (
    <div className="blur">
      <div className="postBox infosBox" ref={modal}>
        <div className="box_header">
          <div className="small_circle" onClick={() => setVisible(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Edit Details</span>
        </div>
        <div className="details_wrapper scrollbar">
          <div className="details_col">
            <span>Customise your Intro</span>
            <span>Details you publish will be public.</span>
          </div>
          <div className="details_header">Other Name</div>
          <Detail
            value={details?.othername}
            img="studies"
            placeholder="Add Othername"
            name="othername"
            text="Other Name"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <div className="details_header">Work</div>
          <Detail
            value={details?.job}
            img="job"
            placeholder="Add Job Role"
            name="job"
            text="Job Role"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <Detail
            value={details?.workplace}
            img="studies"
            placeholder="Add Workplace"
            name="workplace"
            text="Workplace"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <div className="details_header">Education</div>
          <Detail
            value={details?.highSchool}
            img="studies"
            placeholder="Add High School Name"
            name="highSchool"
            text="Highschool"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <Detail
            value={details?.college}
            img="studies"
            placeholder="Add Workplace"
            name="college"
            text="College"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <div className="details_header">Current City</div>
          <Detail
            value={details?.currentCity}
            img="home"
            placeholder="Add your current city."
            name="currentCity"
            text="your current city"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <div className="details_header">Home Town</div>
          <Detail
            value={details?.hometown}
            img="home"
            placeholder="Add your home town."
            name="hometown"
            text="your home town"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <div className="details_header">Relationship</div>
          <Detail
            value={details?.relationship}
            img="relationship"
            name="relationship"
            text="relationship"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
            rel
          />
          <div className="details_header">Instagram</div>
          <Detail
            value={details?.instagram}
            img="instagram"
            placeholder="Add your instagram user name."
            name="instagram"
            text="your instagram handle"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
        </div>
      </div>
    </div>
  )
}

export default EditDetails
