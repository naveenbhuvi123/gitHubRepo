import './index.css'

const LanguageFilterItem = props => {
  const {itemDetails, isActive, changeActiveBtn} = props
  const {id, language} = itemDetails

  const onClickEvent = () => {
    changeActiveBtn(id)
  }

  const newClassName = isActive ? 'selected-button' : 'button'
  return (
    <li className="item-list">
      <button type="button" className={newClassName} onClick={onClickEvent}>
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
