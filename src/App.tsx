import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuctionListing from './Pages/AuctionListing';
import Main from './Pages/Main';
import Profile from './Pages/Profile';
import { Auction, TimeLeft } from './models/Model';
import Login from './Pages/Login';
import Register from './Pages/Register';
import AuctionCreation from './Pages/AuctionCreation';
import EditAlbum from './components/AlbumDetailComponents/EditAlbum';
import Cookies from 'js-cookie';

const App: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const remainingTimer = (auctionTime: Date) => {
    var timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0}
    var timeLeftString: string = "";

    const leadingZero = (num: number) => {
      if(num < 10) {
          return '0' + num;
      }
      return num;
    }
    const calcTimeRemaining = () => {
      var time: Date = new Date(auctionTime)
      return time.getTime() - new Date().getTime();
    }

    const formatDateTime = () => {
      if(timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
          timeLeftString = 'Done';
      }
      timeLeftString = `${leadingZero(timeLeft.days)}:${leadingZero(timeLeft.hours)}:${leadingZero(timeLeft.minutes)}:${leadingZero(timeLeft.seconds)}`;
    }

    const timeRemaining: number = calcTimeRemaining();

    var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    var hours = Math.floor(timeRemaining % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    var minutes = Math.floor(timeRemaining % (1000 * 60 * 60) / (1000 * 60))
    var seconds = Math.floor(timeRemaining % (1000 * 60) / 1000)

    timeLeft = { days: days <= 0 ? 0 : days, hours: hours <= 0 ? 0 : hours, minutes: minutes <= 0 ? 0 : minutes, seconds: seconds <= 0 ? 0 : seconds };

    formatDateTime();

    return timeLeftString
  }

  const checkTokenValidation = async () => {
    var result = await fetch(`apiUser/SignIn/validateToken`, {
      method: 'get',
      headers: new Headers({
        'Authorization' : 'Bearer ' + Cookies.get('jwtoken')
      })
    });

    console.log(result)
    if(result.status !== 200) {
      Cookies.remove('jwtoken')
      localStorage.removeItem('jwtPayload')
      return false;
    }

    return true;
  }

  useEffect(() => {
    checkTokenValidation();
  }, [])
  
  
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Main auctions={auctions} setAuctions={setAuctions} remainingTimer={remainingTimer} />} />
          <Route path='/auctionlisting' element={<AuctionListing auctions={auctions} remainingTimer={remainingTimer} checkTokenValidation={checkTokenValidation} />} />
          <Route path='/profile' element={<Profile checkTokenValidation={checkTokenValidation} />} />
          <Route path='/login' element={<Login checkTokenValidation={checkTokenValidation} />} />
          <Route path='/register' element={<Register checkTokenValidation={checkTokenValidation} />} />
          <Route path='/createauction' element={<AuctionCreation checkTokenValidation={checkTokenValidation} />} />
          <Route path='/editAuction' element={<EditAlbum checkTokenValidation={checkTokenValidation} />}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;
