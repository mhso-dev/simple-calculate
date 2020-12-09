import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorPresenter from "./CalculatorPresenter";
import produce from "immer";
import copy from "copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CalculatorContainer = () => {
  const [rounds, setRounds] = useState([
    {
      id: 0,
      people: "",
      amount: "",
      place: "",
    },
  ]);

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
    // window.getSelection().selectAllChildren(resultBox.current);
    const text = resultBox.current.innerText;
    const textarea = document.createElement("textarea");
    textarea.text = text;

    copy(textarea.text, {
      format: "text/plain",
    });
    setCopied(true);
    toast("클립보드 복사 성공!");
  };

  useEffect(() => {
    inputContainerBox.current.scrollTop =
      inputContainerBox.current.scrollHeight;
  }, [rounds]);

  return (
    <>
      <CalculatorPresenter
        copied={copied}
        rounds={rounds}
        _handleRoundsChanges={_handleRoundsChanges}
        _handleAddRounds={_handleAddRounds}
        _handleDeleteRounds={_handleDeleteRounds}
        _handleCopyClipBoard={_handleCopyClipBoard}
        inputContainerBox={inputContainerBox}
        resultBox={resultBox}
      />
      <ToastContainer />
    </>
  );
};

export default CalculatorContainer;
