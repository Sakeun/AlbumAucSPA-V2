import React, { useState } from 'react'
import './albumdetails.css'

interface Props {
    isOpen: boolean,
    onClose: () => void,
    onBidPlaced: (value: number) => Promise<void>,
    isAuthorized: boolean
}

const Modal: React.FC<Props> = ({isOpen, onClose, onBidPlaced, isAuthorized}) => {
    const [currentBid, setCurrentBid] = useState<number>(0)
    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onBidPlaced(currentBid);

        onClose();
    }

    if(!isOpen) {
        return null;
    }

    if(!isAuthorized) {
        return(<p>You have to be logged in in order to bid!</p>)
    }
  return (
    <div className='modal'>
        <div>
            <button onClick={onClose}>X</button>
            <form action="" onSubmit={(e) => onSubmitForm(e)}>
                <input type="number" id='inputField' value={currentBid} onChange={(e) => setCurrentBid(parseFloat(e.target.value))} />
                <button>Close popup</button>
            </form>
        </div>
    </div>
  )
}

export default Modal