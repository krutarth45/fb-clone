const Bio = ({
  infos,
  handleChange,
  max,
  setShowBio,
  updateDetails,
  placeholder,
  name,
  detail,
  setShow,
  rel,
}) => {
  return (
    <div className="add_bio_wrap">
      {rel ? (
        <select
          className="select_rel"
          name={name}
          value={infos?.relationship}
          onChange={handleChange}
        >
          <option value="Single">Single</option>
          <option value="In a Relationship">In a Relationship</option>
          <option value="Engaged">Engaged</option>
          <option value="Married">Married</option>
          <option value="Divorsed">Divorsed</option>
        </select>
      ) : (
        <textarea
          placeholder={placeholder}
          name={name}
          value={infos?.[name]}
          maxLength={detail ? 25 : 100}
          onChange={handleChange}
          className="textarea_blue details_input"
        ></textarea>
      )}
      {!detail && <div className="remaining">{max} characters remaining</div>}
      <div className="flex">
        <div className="flex flex_left">
          <i className="public_icon"></i>Public
        </div>
        <div className="flex flex_rigth">
          <button
            className="gray_btn"
            onClick={() => {
              !detail ? setShowBio(false) : setShow(false)
            }}
          >
            Cancel
          </button>
          <button
            className="blue_btn"
            onClick={() => {
              !detail && updateDetails()
              detail && updateDetails()
              detail && setShow(false)
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default Bio
