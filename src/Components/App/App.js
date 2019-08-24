import React, { Component } from "react";
// 라우딩 설정 -> 브라우저 뒤로, 앞으로가기 등 url:[history, location] 과 같은 경로 설정
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Notes from "../../Routes/Notes";
import Note from "../../Routes/Note";
import Edit from "../../Routes/Edit";
import Add from "../../Routes/Add";

class App extends Component {
	render() {
		return (
			// BrowserRouter: Link, Route 컴포넌트를 묶어 경로 이동을 유기적으로 만듬(필수)
			<BrowserRouter>
				<Switch />
				{/* Route 는 현재 주소창 경로와 같을 경우 보여주는 Component -> exact(기본 경로, 필수), path(경로), component(보여줄 구성요소) prop 이다. */}
				<Route exact={true} path={"/"} component={Notes} />
				<Route path={"/add"} component={Add} />
				<Route path={"/note/:id"} component={Note} />
				<Route path={"/edit/:id"} component={Edit} />
			</BrowserRouter>
		);
	}
}

// default 키워드와 함께 export한 모듈은 {} 없이 임의의 이름으로 import한다.
export default App;
