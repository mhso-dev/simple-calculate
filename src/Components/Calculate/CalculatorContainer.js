import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorPresenter from "./CalculatorPresenter";
import produce from "immer";
import Store from "../../store";
const CalculatorContainer = () => {
  const [totalAmount, setTotalAmount] = useState();
  const [rounds, setRounds] = useState([
    {
      id: 0,
      people: "",
      amount: "",
      place: ""
    }
  ]);

  const inputContainerBox = useRef();

  const _handleRoundsChanges = useCallback((e, index, section) => {
    const value = e.target.value;
    setRounds(
      produce(draft => {
        draft[index][section] = value;
        return draft;
      })
    );
  }, []);

  const _handleAddRounds = () => {
    setRounds(
      produce(draft => {
        const newRound = {
          id: rounds.length,
          people: "",
          amount: "",
          place: ""
        };
        draft.push(newRound);
        return draft;
      })
    );
  };

  const _handleDeleteRounds = id => {
    if (window.confirm("지울거에요?🙅🏻‍♂️")) {
      setRounds(
        produce(draft => {
          draft.splice(draft.findIndex(round => round.id === id));
        })
      );
    }
  };

  useEffect(() => {
    inputContainerBox.current.scrollTop =
      inputContainerBox.current.scrollHeight;
  }, [rounds]);

  return (
    <Store.Provider value={totalAmount}>
      <CalculatorPresenter
        rounds={rounds}
        _handleRoundsChanges={_handleRoundsChanges}
        _handleAddRounds={_handleAddRounds}
        _handleDeleteRounds={_handleDeleteRounds}
        inputContainerBox={inputContainerBox}
        setTotalAmount={setTotalAmount}
      />
    </Store.Provider>
  );
};

export default CalculatorContainer;
