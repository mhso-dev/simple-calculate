import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorPresenter from "./CalculatorPresenter";
import produce from "immer";

const CalculatorContainer = () => {
  const [rounds, setRounds] = useState([
    {
      id: 0,
      people: "",
      amount: "",
      place: "",
    },
  ]);

  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);

  const inputContainerBox = useRef();
  const resultBox = useRef();

  const _handleRoundsChanges = useCallback((e, index, section) => {
    const value = e.target.value;
    setCopied(false);
    setRounds(
      produce((draft) => {
        draft[index][section] = value;
        return draft;
      })
    );
  }, []);

  const _handleAddRounds = () => {
    setCopied(false);
    setRounds(
      produce((draft) => {
        const newRound = {
          id: rounds.length,
          people: rounds[rounds.length - 1].people,
          amount: "",
          place: "",
        };
        draft.push(newRound);
        return draft;
      })
    );
  };

  const _handleDeleteRounds = (id) => {
    if (window.confirm("지울거에요?🙅🏻‍♂️")) {
      setCopied(false);
      setRounds(
        produce((draft) => {
          draft.splice(draft.findIndex((round) => round.id === id));
        })
      );
    }
  };

  const _handleCopyClipBoard = () => {
    setCopied(true);
  };

  useEffect(() => {
    inputContainerBox.current.scrollTop =
      inputContainerBox.current.scrollHeight;
  }, [rounds]);

  return (
    <CalculatorPresenter
      rounds={rounds}
      _handleRoundsChanges={_handleRoundsChanges}
      _handleAddRounds={_handleAddRounds}
      _handleDeleteRounds={_handleDeleteRounds}
      _handleCopyClipBoard={_handleCopyClipBoard}
      inputContainerBox={inputContainerBox}
      resultBox={resultBox}
    />
  );
};

export default CalculatorContainer;
