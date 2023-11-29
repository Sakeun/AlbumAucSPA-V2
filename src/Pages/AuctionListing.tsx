import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import AlbumDetails from '../components/AlbumDetailComponents/AlbumDetails'
import ErrorPage from '../components/ErrorPage'
import Header from '../components/Header'
import { Auction, SingleAuctionData } from '../models/Model'
import './pagestyles.css'

interface Props {
    auctions: Auction[],
    remainingTimer: (auction: Date) => string,
    checkTokenValidation: () => Promise<boolean>
}

const AuctionListing: React.FC<Props> = ({ auctions, remainingTimer, checkTokenValidation }) => {
  const [searchParams] = useSearchParams();
  const [timeLeftString, setTimeLeftString] = useState<string>("")
  const [activeAuc, setActiveAuc] = useState<SingleAuctionData>({ id: 0, sellerId: "", name: "", endingTime: new Date(), genre: "", isDone: false, condition: "", bids: [{
    id: 0,
    userId: "",
    albumId: 0,
    amount: 0,
    bidPlaced: new Date()
  }]})

  //const changeColor = useRef<HTMLParagraphElement>(null);

  // function to get the auction which was clicked on (via querystring). Currently hardcoded to array, once API has been setup has to be changed to get from database
  const getClickedAuction = async () => {
    console.log(auctions);
    var currentid = searchParams.get('id');
    var currentAuc: SingleAuctionData = await axios.get<SingleAuctionData>(`apiAuc/ViewAuc/findAlbum/${currentid}`).then(response => {return response.data});
    var auction: SingleAuctionData = activeAuc
    if(currentAuc !== undefined) {
      auction = currentAuc
      console.log(auction)
      setActiveAuc(auction);
    } else {
      console.log(auction)
      setActiveAuc(auction);
    }
  }

  const updateBid = (bid: number) => {
      setActiveAuc({...activeAuc, bids: [...activeAuc.bids, {
        id: activeAuc.bids[0].id + 1,
        userId: "",
        albumId: 0,
        amount: bid,
        bidPlaced: new Date()
      }]});
  }
  

  useEffect(() => {
    const getCurrentAuc = async () => {
      await getClickedAuction();
    }
    
    if(activeAuc.id.toString() !== searchParams.get('id')) {
      getCurrentAuc();
    }

    const interval = setInterval(() => {
      setTimeLeftString(remainingTimer(activeAuc.endingTime));
    }, 50)

    return () => clearInterval(interval);
  });

  return (
    <div className='auction-listing'>
      <Header />
      <AlbumDetails auction={activeAuc} updateBid={updateBid} timeLeftString={timeLeftString} checkTokenValidation={checkTokenValidation} />
    </div>
  )
}

export default AuctionListing
