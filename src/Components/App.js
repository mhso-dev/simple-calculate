import React from "react";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyles from "../Styles/GlobalStyles";
import Theme from "../Styles/Theme";

import Calculate from "./Calculate";
import Helmet from "react-helmet";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 935px;
  width: 100%;
`;

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Helmet>
        <title>얼마나 먹었니?</title>
      </Helmet>
      <Wrapper>
        <GlobalStyles />
        <Calculate />
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
