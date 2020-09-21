import React from 'react'
import ErrorReplacer from '../../containers/ErrorReplacer/ErrorReplacer'

export default class Auth extends React.Component {
  state = {
    isError: false
  }

  componentDidCatch() {

  }

  static getDerivedStateFromError(error: any) {
    return { isError: true }
  }

  render() {
    if (this.state.isError) return ErrorReplacer

    return this.props.children
  }
}
