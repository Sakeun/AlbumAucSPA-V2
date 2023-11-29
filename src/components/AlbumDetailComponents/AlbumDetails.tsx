import React, { useState, useEffect } from 'react'
import { JwTokenData, SingleAuctionData } from '../../models/Model'
import './albumdetails.css'
import Modal from './Modal'
import { HttpTransportType, HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';



interface Props {
    auction: SingleAuctionData,
    updateBid: (bid: number) => void,
    timeLeftString: string,
    checkTokenValidation: () => Promise<boolean>
}

const AlbumDetails: React.FC<Props> = ({ auction, updateBid, timeLeftString, checkTokenValidation }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [connection, setConnection] = useState<HubConnection>();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [userSeller, setUserSeller] = useState<string>("album-details__edit-auction-button hidden")
    const [user, setUser] = useState<JwTokenData>({ nameid: "", email: "", exp: 0, iat: 0, nbf: 0, unique_name: "", role: ""})

    const onBidPlaced = async (value: number) => {
        if(value <= auction.bids[0].amount) {
            return;
        }
        const res = await fetch(`apiAuc/ViewAuc/placeBid`, {
            method: 'post',
            headers: new Headers({
                'Authorization': 'Bearer ' + Cookies.get('jwtoken'),
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                albumId: auction.id,
                bid: value,
                userId: user.nameid
            })
        });

        console.log(res)
    }

    const isUserSeller = () => {
        console.log(parseInt(user.nameid) + " " + auction.sellerId)
        if(user.nameid == auction.sellerId) {
            setUserSeller("album-details__edit-auction-button visible");
        }
    }


    useEffect(() => {
        const connect = new HubConnectionBuilder()
          .withUrl("/hubs/bids", {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
            withCredentials: false
          })
          .withAutomaticReconnect()
          .build();
    
        setConnection(connect);

        
        checkTokenValidation().then(value => {
            if(value === true) {
                setIsAuthorized(true);
                setUser(JSON.parse(window.atob(localStorage.getItem("jwtPayload") ?? "")));
            }
        })
    }, []);

    useEffect(() => {
        if(connection) {
            connection.start().then(() => {
                connection?.on("sendBidToReact", (bid, id) => {
                    updateBid(bid);
                    console.log(bid + " " + id);
                })
            })
            .catch((error) => console.log(error));
        }
    }, [connection])

    useEffect(() => {isUserSeller();}, [user, auction])

    return (
        <div className='album-details'>
            <div className="album-details__title">
                <h1 className="album-details__title-h1">{auction.name}</h1>
            </div>
            <div className="album-details__edit-auction">
                <Link to={`/editAuction?id=${auction.id}`} className={userSeller}>Edit Auction</Link>
            </div>
            <div className="album-details__information-imagecontainter">
                <img src="https://ipurple.eu/3955-large_default/le-sserafim-antifragile-compact-ver.jpg" alt="DiscImage" className="album-details__information-image" />
            </div>
            <div className="album-details__information-elements">
                <p className="album-details__information-element">Genre: {auction.genre}</p>
                <p className="album-details__information-element">Condition: {auction.condition}</p>
                <p className="album-details__information-element">ID: {auction.id}</p>
            </div>

            <div className="auctions-singleauc__pricetime">
                <div className="auctions-singleauc__pricetime-item">Current highest bid: {auction.bids[0].amount}</div>
                <p className="auctions-singleauc__pricetime-item" >Remaining time: {timeLeftString}</p>
            </div>
            <div className="auctions-details__placebid">
                <button className="auctions-details__placebid-button" onClick={() => {setModalOpen(true)}}>Place bid</button>
                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} onBidPlaced={onBidPlaced} isAuthorized={isAuthorized} />
            </div>
        </div>
    )
}

export default AlbumDetails
