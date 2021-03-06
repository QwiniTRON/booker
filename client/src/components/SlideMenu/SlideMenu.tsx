import React, { useState } from 'react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { S } from '../../utils/Utils'

import c from './SlideMenu.module.scss'

type SlideMenuProps = {
  helper: any
}

const SlideMenu: React.FC<SlideMenuProps> = function (props) {
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const sidePanelClasses = S(c['side-panel'])
  if (sideMenuOpen) sidePanelClasses.add(c['open'])

  props.helper.current = {
    close() {
      setSideMenuOpen(false)
    },
    open() {
      setSideMenuOpen(true)
    }
  }

  return (
    <div className={sidePanelClasses()}>

      <div className={c["side-panel__body"]}>
        {props.children}
      </div>

      <div onClick={(e) => { setSideMenuOpen(!sideMenuOpen) }} className={c["side-panel__opener"]}>
        <span><Fa icon={faEllipsisV} /></span>
      </div>
      <div onClick={(e) => { setSideMenuOpen(!sideMenuOpen) }} className={c["side-panel__layout"]}></div>
      <div className={c["side-panel__closer"]} onClick={(e) => { setSideMenuOpen(!sideMenuOpen) }}>&times;</div>
    </div>
  );
}

export default SlideMenu