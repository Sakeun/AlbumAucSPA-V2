import React, { Dispatch, SetStateAction, useEffect } from 'react';
import AucList from '../components/AucList';
import Header from '../components/Header';
import { Auction, AuctionApiResult } from '../models/Model';
import axios from 'axios';

interface Props {
  auctions: Auction[],
  setAuctions: Dispatch<SetStateAction<Auction[]>>,
  remainingTimer: (auction: Date) => string,
}

const Main: React.FC<Props> = ({ auctions, setAuctions, remainingTimer }) => {
  const getAuctions = async () => {

    const result = await fetch('apiAuc/ViewAuc/getAllAuctions', {
      method: 'get'
    })
    console.log(result.json());
    const data: Auction[] = await axios.get<Auction[]>('apiAuc/ViewAuc/getAllAuctions').then(response => {return response.data})
  
    var aucs: Auction[] = []
    data.map((auction: Auction) => {
      aucs.push({ id: auction.id, name: auction.name, bids: auction.bids === null ? [{ id: 0, amount: 0, albumId: 0, userId: "", bidPlaced: new Date() }] : [{ id: auction.bids[0].id, amount: auction.bids[0].amount, albumId: auction.bids[0].albumId, userId: auction.bids[0].userId, bidPlaced: new Date(auction.bids[0].bidPlaced) }] , endingTime: auction.endingTime, genre: auction.genre, condition: auction.condition, isDone: auction.isDone})
    })

    setAuctions(aucs);
    console.log(aucs);
  }

  

  useEffect(() => {getAuctions();}, []);

  return (
    <div className="App">
      <Header />
      <AucList auctions={auctions} remainingTimer={remainingTimer} />
    </div>
  );
}

export default Main;