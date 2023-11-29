import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { AuctionApiData, JwTokenData } from "../models/Model";
import "./pagestyles.css";
import jwt_decode from "jwt-decode";
import ErrorPage from "../components/ErrorPage";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface Props {
  checkTokenValidation: () => Promise<boolean>;
}

const AuctionCreation: React.FC<Props> = ({ checkTokenValidation }) => {
  const [auction, setAuction] = useState<AuctionApiData>({
    seller: "",
    name: "",
    genre: "",
    condition: "",
    endingTime: new Date(),
    bids: { amount: 0 },
  });
  const [user, setUser] = useState<JwTokenData>({
    nameid: "",
    email: "",
    exp: 0,
    iat: 0,
    nbf: 0,
    unique_name: "",
    role: "",
  });

  var navigation = useNavigate();

  //const user = jwt_decode<JwTokenData>(localStorage.getItem("jwtoken") ?? "");

  useEffect(() => {
    console.log(user);

    if (localStorage.getItem("jwtPayload") != null) {
      setUser(
        JSON.parse(window.atob(localStorage.getItem("jwtPayload") ?? ""))
      );
    }
    //setAuction({ ...auction, seller: parseInt(user.nameid)})
  }, []);

  useEffect(() => {
    setAuction({ ...auction, seller: user.nameid });
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(JSON.stringify(auction));
    //setAuction({...auction, seller: parseInt(user.nameid)})
    var result = await fetch("apiAuc/ViewAuc/insertAuc", {
      method: "post",
      headers: new Headers({
        Authorization: "Bearer " + Cookies.get("jwtoken"),
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        seller: auction.seller,
        name: auction.name,
        genre: auction.genre,
        condition: auction.condition,
        endingTime: auction.endingTime,
        latestBid: auction.bids.amount,
      }),
    });

    if (result.status == 200) {
      navigation(-1);
    }
  };

  if (user.nameid === "") {
    return <ErrorPage />;
  }

  return (
    <div>
      <Header />
      <form className="create-auc-form" onSubmit={(e) => onSubmit(e)}>
        <input
          type="text"
          className="create-auc-form__input"
          placeholder="name"
          onChange={(e) => setAuction({ ...auction, name: e.target.value })}
        />
        <input
          type="text"
          className="create-auc-form__input"
          placeholder="genre"
          onChange={(e) => setAuction({ ...auction, genre: e.target.value })}
        />
        <input
          type="text"
          className="create-auc-form__input"
          placeholder="condition"
          onChange={(e) =>
            setAuction({ ...auction, condition: e.target.value })
          }
        />
        <input
          type="text"
          className="create-auc-form__input"
          placeholder="starting price"
          onChange={(e) =>
            setAuction({
              ...auction,
              bids: { amount: parseFloat(e.target.value) },
            })
          }
        />
        <label htmlFor="starting-date">Pick an ending time:</label>
        <input
          type="date"
          id="starting-date"
          onChange={(e) =>
            setAuction({
              ...auction,
              endingTime: new Date(Date.parse(e.target.value)),
            })
          }
        />
        <input type="submit" value="Place auction" />
      </form>
    </div>
  );
};

export default AuctionCreation;
