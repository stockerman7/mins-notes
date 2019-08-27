import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App/App";
import { ApolloProvider } from "react-apollo"; // server 측 구성 요소
import client from "./apollo"; // clinet 측과 대화를 위해 연결
import GlobalStyle from "./globalStyles";

// ApolloProvider: Apollo Client를 React에 연결하여 React Apollo를 사용하여 쿼리 구성 요소를 빌드한다.
// 자세히 보면 안에 ApolloProvider가 React App인 <App /> 감싸고 있고, client prop으로 Apollo Client와 연결되어 있다.
// 결국 React - Apollo - GraphQL 로 연결하는 구간이다.
ReactDOM.render(
	<ApolloProvider client={client}>
		<GlobalStyle />
		<App />
	</ApolloProvider>,
	document.getElementById("root"),
);
