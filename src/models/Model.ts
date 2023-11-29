export interface Auction {
    id: number,
    name: string,
    genre: string,
    endingTime: string,
    condition: string,
    isDone: boolean,
    bids: Bids[]
}

export interface TimeLeft {
    days: number,
    hours: number,
    minutes: number,
    seconds: number
}

export interface AuctionApiResult {
    id: number,
    name: string,
    latestBid: number,
    endingTime: Date,
    condition: string,
    isDone: boolean
}

export interface AuctionApiData {
    seller: string,
    name: string,
    genre: string,
    condition: string,
    endingTime: Date,
    bids: {
        amount: number
    }
}

export interface SignalrBidData {
    bid: number,
    id: number
}

export interface JwTokenData {
    email: string,
    exp: number,
    iat: number,
    nameid: string,
    nbf: number,
    unique_name: string,
    role: string
}

export interface SingleAuctionData {
name: string,
sellerId: string,
genre: string,
condition: string,
endingTime: Date,
isDone: boolean,
id: number,
bids: Bids[]
}

interface Bids {
    id: number,
    userId: string,
    albumId: number,
    amount: number,
    bidPlaced: Date
}

export interface RegisterData {
    username: string,
    email: string,
    confirmEmail: string,
    password: string,
    confirmPassword: string,
    country: string
}