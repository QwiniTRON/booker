import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {authLogout} from '../../redux/actions/Auth'

type LogoutProps = {
  [p: string]: any
}

const Logout: React.FC<LogoutProps> = function (props) {
  useEffect(() => {
    props.authLogout()
  }, [])

  return (
    <Redirect to="/" />
  );
}


const mapDispatchToProps = {
  authLogout
}

export default connect(null, mapDispatchToProps)(Logout)