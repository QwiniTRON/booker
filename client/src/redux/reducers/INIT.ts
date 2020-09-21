import { SET_INIT_STATUS } from '../Consts'
import { initAction } from '../Types'

type initStateType = {
  isInit: boolean
}

const initialState = {
  isInit: false
}

export default function (state: initStateType = initialState, action: initAction): initStateType {
  switch (action.type) {
    case SET_INIT_STATUS:
      return { ...state, isInit: action.status }

    default:
      return state
  }
}