import axios from 'axios'
import React from 'react'

const AucButton: React.FC = () => {
    const onHandleClick = async () => {
        var result = await fetch(`apiUser/SignIn/ValidateToken`, {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + localStorage.getItem('jwtoken')
            })
        });

        console.log(result);

        if(result.status !== 200) {
            localStorage.removeItem("jwtoken")
        }
    }
  return (
    <button onClick={onHandleClick}>Validate token</button>
  )
}

export default AucButton
