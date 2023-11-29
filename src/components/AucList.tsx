import React from 'react'
import { Auction } from '../models/Model'
import SingleAuc from './SingleAuc'
import './styles.css'

interface Props {
    auctions: Auction[]
    remainingTimer: (auction: Date) => string
}

// Map all auctions to a list for the main page
const AucList: React.FC<Props> = ({ auctions, remainingTimer }) => {
  return (
    <section className='auctions'>
        {auctions.map((auction) => (
            <SingleAuc auction={auction} remainingTimer={remainingTimer} key={auction.id} />
        ))}
    </section>
  )
}

export default AucList
