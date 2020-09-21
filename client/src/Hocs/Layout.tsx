import React from 'react'
import {connect} from 'react-redux'
import Header from '../components/Navigation/Header';
import { RootState } from '../redux/mainReducer';
import Footer from '../components/Navigation/Footer';

type layoutProps = {
  [p:string]: any
}

export const Layout: React.FC<layoutProps> = function (props) {
  return (
    <>
      <Header isAuth={props.isAuth} />
      <main>
        {props.children}
      </main>
      <Footer />
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    isAuth: state.auth.accessToken
  }
}

export default connect(mapStateToProps)(Layout)