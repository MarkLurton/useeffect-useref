import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";

const Deck = () => {
  const [card, setCard] = useState();
  const [deckId, setDeckId] = useState("new");
  const [deckOut, setDeckOut] = useState(false);
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    async function createDeck() {
      const res = await axios.get(
        `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
      );
      setDeckId(res.data.deck_id);
    }

    async function drawCard() {
      if (!deckOut) {
        console.log("cards remaining");
        let resp = await axios.get(
          `https://deckofcardsapi.com/api/deck/${deckId}/draw`
        );
        const newCard = resp.data.cards[0];
        setCard(newCard);
        if (resp.data.remaining === 0) {
          setDeckOut(true);
        }
      } else {
        window.alert("Error: no cards remaining!");
        setDraw(false);
      }
    }

    if (deckId === "new") {
      createDeck();
    }
    if (draw) {
      const intervalId = setInterval(() => {
        drawCard();
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [deckId, draw, deckOut]);

  async function handleClick() {
    setDraw(!draw);
  }

  return (
    <div>
      {draw ? (
        <button onClick={handleClick}>Stop drawing</button>
      ) : (
        <button onClick={handleClick}>Start drawing</button>
      )}
      {card ? <Card card={card.image} /> : null}
    </div>
  );
};

export default Deck;
