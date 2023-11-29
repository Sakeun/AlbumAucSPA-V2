import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { JwTokenData, SingleAuctionData } from '../../models/Model'
import ErrorPage from '../ErrorPage'
import Header from '../Header'
import './albumdetails.css'
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'

interface Props {
    checkTokenValidation: () => Promise<boolean>
}

const EditAlbum: React.FC<Props> = ({ checkTokenValidation }) => {

    const [searchParams] = useSearchParams();
    const [auction, setAuction] = useState<SingleAuctionData>({ id: 0, sellerId: "", name: "", endingTime: new Date(), genre: "", isDone: false, condition: "", bids: [{
        id: 0,
        userId: "",
        albumId: 0,
        amount: 0,
        bidPlaced: new Date()
    }]})
    const [bidPlaced, setBidPlaced] = useState<boolean>(false)
    const [authorized, setAuthorized] = useState(false)

    const getClickedAuction = async () => {
        var currentid = searchParams.get('id');
        var currentAuc: SingleAuctionData = await axios.get<SingleAuctionData>(`apiAuc/ViewAuc/findAlbum/${currentid}`).then(response => {return response.data});
        var auc: SingleAuctionData = auction;
        if(currentAuc !== undefined) {
            if(currentAuc.bids.length > 1) {
                setBidPlaced(true);
            }
          auc = currentAuc
          setAuction(auc);
        } else {
          setAuction(auc);
        }
    }


    useEffect(() => {
        getClickedAuction();
        const checkValid = async () => {
            setAuthorized(await checkTokenValidation());
        }

        checkValid();
    }, [])

    if(!authorized) {
        return <ErrorPage />
    }

    const user: JwTokenData = JSON.parse(window.atob(localStorage.getItem("jwtPayload") ?? ""));
    const onDeleteClicked = async () => {
        if(auction.bids.length > 1 || user.nameid !== auction.sellerId) {
            return;
        }

        console.log(user.nameid)
        // var result = await fetch(`https://localhost:7044/api/ViewAuc/deleteAuction/${auction.id}`, {
        //     method: 'delete',
        //     headers: new Headers({
        //         Authorization: 'Bearer ' + Cookies.get('jwtoken'),
        //         "Content-Type": "application/json",
        //     }),
        //     body: JSON.stringify({
        //         userId: user.nameid
        //     })
        // });
        var result = await axios.delete(`apiAuc/ViewAuc/deleteAuction/${auction.id}`, 
        { data: { userId: user.nameid}, headers: { Authorization: 'Bearer ' + Cookies.get('jwtoken'), }})

        console.log(result);
    }

    return (
        <div className='edit-auc'>
            <Header />
            <div className="edit-auc__title">
            <h1 className='edit-auc__title--h1'>Edit details for "{auction.name}"</h1>
        <h3 className='edit-auc__title--h2'>Auctions can only be edited or deleted when no prior bid has been placed</h3>
        </div>
        <div className="edit-auc__form">
            <label htmlFor="title">Edit title:</label>
            <input type="text" id='title' disabled={bidPlaced} value={auction.name} onChange={(e) => setAuction({...auction, name: e.target.value})} />
            <label htmlFor="price">Edit price:</label>
            <input type="text" id='price' disabled={bidPlaced} value={auction.bids[0].amount} />
            <label htmlFor="condition">Edit condition:</label>
            <input type="text" id='condition' disabled={bidPlaced} value={auction.condition} />
            <label htmlFor="ending-time">Edit ending time:</label>
            <input type="date" id='ending-time' disabled={bidPlaced} value={auction.endingTime.toString()} />
            <button className="edit-auc__form-delete" onClick={onDeleteClicked}>Delete Auction</button>
            <button className="edit-auc__form-delete">Save changes</button>
        </div>
        </div>
  )
}

export default EditAlbum
