import React, { useEffect, useRef, useState } from 'react'
import { Auction, TimeLeft } from '../models/Model'
import { BrowserRouter as Route, Link } from 'react-router-dom';
import './styles.css'
import AucButton from './AucButton';

// initialize all the props that will be given with single auc
interface Props {
    auction: Auction,
    remainingTimer: (auction: Date) => string
}
const SingleAuc: React.FC<Props> = ({auction, remainingTimer}) => {

    // functions to make the auction "dynamicall" change color, currently still hardcoded with a button
    const changeColor = useRef<HTMLParagraphElement>(null);
    const [timeLeftString, setTimeLeftString] = useState<string>("")

    useEffect(() => {      
        const interval = setInterval(() => {
            let time = new Date(auction.endingTime)
            //console.log(time)
            setTimeLeftString(remainingTimer(time));

            var days = parseInt(timeLeftString.slice(0, 2));
            if(changeColor.current !== null && (timeLeftString === 'Done' || days <= 1)) {
                changeColor.current.style.color = 'red';
            } else if(changeColor.current !== null) {
                changeColor.current.style.color = 'green';
            }
        }, 0)

        return () => clearInterval(interval);
    })

  return (
    <div className="container" key={auction.id}>
    <Link to={`/auctionlisting?id=${auction.id}`} className='test'>
        <div className="auctions-singleauc">
            <div className="auctions-singleauc__features">
                <div className="auctions-singleauc__information">
                    <div className="auctions-singleauc__information-imagecontainter">
                        <img src="https://ipurple.eu/3955-large_default/le-sserafim-antifragile-compact-ver.jpg" alt="DiscImage" className="auctions-singleauc__information-image" />
                    </div>
                    <div className="auctions-singleauc__information-elements">
                        <h1 className="auctions-singleauc__information-element">{auction.name}</h1>
                        <p className="auctions-singleauc__information-element">Genre: {auction.genre}</p>
                        <p className="auctions-singleauc__information-element">Condition: {auction.condition}</p>
                        <p className="auctions-singleauc__information-element">ID: {auction.id}</p>
                    </div>
                </div>
                <div className="auctions-singleauc__pricetime">
                    <div className="auctions-singleauc__pricetime-item">Current highest bid: {auction.bids[0].amount}</div>
                    <p className="auctions-singleauc__pricetime-item" ref={changeColor}>Remaining time: {timeLeftString}</p>
                </div>
            </div>
            
        </div>
    </Link>
    </div>
  )
}

export default SingleAuc