import React, { useEffect } from 'react'
import { BrowserRouter as Route, Link } from 'react-router-dom';
import ErrorPage from '../components/ErrorPage';
import Header from '../components/Header';

interface Props {
  checkTokenValidation: () => Promise<boolean>
}

const Profile: React.FC<Props> = ({ checkTokenValidation }) => {

  useEffect(() => {
    checkTokenValidation();
  }, [])
  

  if(localStorage.getItem('jwtoken') == null) {
    return( <ErrorPage /> )
  }

  return (
    <div>
      <Header />
      <Link to={'/'}>Back to main page</Link>
    </div>
  )
}

export default Profile
