function Shortcut({ link, img, name }) {
  return (
    <a href={link} target="_blank" className="shortcut_item hover1">
      <img src={img} alt="" />
      <span>{name}</span>
    </a>
  )
}

export default Shortcut
