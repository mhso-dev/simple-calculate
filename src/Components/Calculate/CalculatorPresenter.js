import React, { useEffect, useState } from "react";
import styled from "styled-components";
import produce from "immer";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  padding: 1rem;
`;

const InputContainer = styled.div`
  ${props => props.theme.whiteBox}
  padding:1rem;
  height: 60vh;
  overflow: scroll;
`;

const RoundSection = styled.div`
  margin-top: 1.5rem;
`;

const StyledInputs = styled.input`
  all: unset;
  border-bottom: 1px solid ${props => props.theme.darkGreyColor};
  color: ${props => props.theme.blackColor};
  width: 100%;
  margin-top: 1rem;
  padding: 0.3rem;
  font-size: 1rem;
  ::placeholder {
    color: ${props => props.theme.blueColor};
  }
`;

const StyledTitle = styled.div`
  color: ${props => props.theme.blackColor};
  font-size: 2rem;
  font-weight: 600;

  margin-top: 1rem;
`;

const HorizontalButton = styled.button`
  margin-top: 0.5rem;
  border: ${props => props.theme.boxBorder};
  text-align: center;
  :focus {
    outline: 0;
    background-color: ${props => props.theme.blueColor};
    color: white;
    transition: 0.2s ease-in-out;
  }
`;

const RoundDeleteButton = styled.button`
  all: unset;
  font-size: 0.3em;
  padding: 3px;
  border: ${props => props.theme.boxBorder};
  :focus {
    background-color: ${props => props.theme.lightGreyColor};
    transition: 0.2s ease-in-out;
  }
`;

const CalculateContainer = styled.div`
  margin-top: 0.5rem;
  height: 25vh;
  border: ${props => props.theme.boxBorder};
  padding: 1rem;
  overflow: scroll;
`;

const CalculateRoundComponent = ({ round }) => {
  const [personList, setPersonList] = useState([]);

  useEffect(() => {
    setPersonList(round.people.trim().split(" "));
  }, [round.people]);

  return (
    <>
      <div>
        {round.id + 1} 차( {round.place} ) 총 금액 {round.amount}
      </div>
      <div>
        {round?.people
          .trim()
          .split(" ")
          .map(name => `${name} `)}{" "}
        ( 총 {personList.length} 명 )
      </div>{" "}
      <div>
        각 {parseInt(round.amount / personList.length)} 원
        {/* /{" "}
        {Math.round(parseInt(round.amount / personList.length) / 1000) * 1000 >
          parseInt(round.amount / personList.length) && (
          <span>
            {Math.round(parseInt(round.amount / personList.length) / 1000) *
              1000}{" "}
            ( 프리미엄비 포함 )
          </span> }
        )*/}
        <br />
        <br />
      </div>
    </>
  );
};

const TotalAmountComponent = ({ rounds }) => {
  const [total, setTotal] = useState();
  const [forPremium, setForPremium] = useState();
  useEffect(() => {
    setTotal(
      produce(_ => {
        const personList = rounds.map(round => {
          const plist = round.people.trim().split(" ");
          const averageAmount = parseInt(round.amount / plist.length);
          const averagePremium =
            Math.round(parseInt(round.amount / plist.length) / 1000) * 1000 >
            averageAmount
              ? Math.round(parseInt(round.amount / plist.length) / 1000) * 1000
              : averageAmount;

          const pAmount = plist.map(name => ({
            name,
            averageAmount,
            averagePremium
          }));

          return pAmount;
        });

        const flat = personList.reduce((acc, value) => {
          return acc.concat(value);
        }, []);

        const reduced = flat.reduce((acc, value) => {
          if (!acc[value.name]) {
            acc[value.name] = { ...value };
            return acc;
          }

          acc[value.name].averageAmount += value.averageAmount;
          acc[value.name].averagePremium += value.averagePremium;

          return acc;
        }, []);

        const result = Object.keys(reduced).map(key => {
          const item = reduced[key];
          return {
            name: item.name,
            totalAmount: item.averageAmount,
            // totalPremium: item.averagePremium
            totalPremium: Math.max(
              Math.round(parseInt(item.averageAmount) / 1000) * 1000,
              item.averageAmount
            ) // 최종 Amount에 대해 100원단위에서 반올림
          };
        });

        return result;
      })
    );
  }, [rounds]);

  useEffect(() => {
    setForPremium(
      produce(_ => {
        if (total && total.length > 0) {
          const totalAmount = total.reduce((acc, value) => {
            return acc + value.totalAmount;
          }, 0);
          const totalPremium = total.reduce((acc, value) => {
            return acc + value.totalPremium;
          }, 0);

          return totalPremium - totalAmount;
        }
      })
    );
  }, [total]);

  return (
    <>
      {total &&
        total.length > 1 &&
        total.map(t => (
          <div key={t.name}>
            <br />
            {t.name} {t.totalAmount}원{" "}
            {t.totalPremium > t.totalAmount && (
              <span>
                / 프리미엄 {t.totalPremium}원 (+{t.totalPremium - t.totalAmount}
                원😀)
              </span>
            )}
          </div>
        ))}
      <br />
      {forPremium > 0 && (
        <div>
          프리미엄비 여기로 (벙주만 입금) 💳 => {forPremium} 원 3333089723279
          카카오뱅크 윤수민 💖소중히 운영금으로 사용하겠습니다 💖
        </div>
      )}
    </>
  );
};

const CalculatorPresenter = ({
  rounds,
  _handleRoundsChanges,
  _handleAddRounds,
  _handleDeleteRounds,
  _handleCopyClipBoard,
  inputContainerBox,
  resultBox
}) => {
  const [bank, setBank] = useState("");

  return (
    <Container>
      <InputContainer ref={inputContainerBox}>
        <StyledInputs
          placeholder="계좌번호랑 예금주 입력해 주세요 💳"
          value={bank}
          onChange={e => {
            setBank(e.target.value);
          }}
        />
        {rounds.map((round, index) => (
          <RoundSection key={index}>
            <StyledTitle>
              {index + 1}차 정산{" "}
              {index !== 0 && (
                <RoundDeleteButton onClick={_handleDeleteRounds}>
                  <span role="img" aria-label="delete round">
                    ❌
                  </span>
                </RoundDeleteButton>
              )}
            </StyledTitle>
            <StyledInputs
              placeholder={"어디서 🍻"}
              value={round.place}
              onChange={e => _handleRoundsChanges(e, index, "place")}
            />
            <StyledInputs
              value={round.people}
              placeholder={"누구랑 👨‍👩‍👧‍👦"}
              onChange={e => _handleRoundsChanges(e, index, "people")}
            />
            <StyledInputs
              type={"number"}
              value={round.amount}
              placeholder={`${index + 1}차 에선 얼마가..? 💵`}
              onChange={e => _handleRoundsChanges(e, index, "amount")}
            />
          </RoundSection>
        ))}
      </InputContainer>
      <HorizontalButton onClick={_handleAddRounds}>
        <span role="img" aria-label="술 더먹으러">
          ➕
        </span>{" "}
        어딜 더 갔을까?
      </HorizontalButton>

      <CalculateContainer ref={resultBox}>
        정산은 여기로 ✅ {bank} <br />
        <br />
        {rounds.map(round => (
          <CalculateRoundComponent round={round} key={round.id} />
        ))}
        <TotalAmountComponent rounds={rounds} />
      </CalculateContainer>

      <CopyToClipboard
        text={resultBox?.current?.innerText}
        onCopy={_handleCopyClipBoard}
      >
        <HorizontalButton>
          <span role="img" aria-label="Copy Clipboard">
            📋
          </span>{" "}
          내용 클립보드로 복사
        </HorizontalButton>
      </CopyToClipboard>
    </Container>
  );
};

export default CalculatorPresenter;
