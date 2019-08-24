import React from "react";
import { Query } from "react-apollo"; // react 와 graphql 간의 상호작용
import { Link } from "react-router-dom"; // react-router-dom 은 BrowserRouter, Switch, Route, Link 등 경로설정과 관련된 구성요소를 가지고 있다.
import { ReactComponent as Plus } from "../../Components/plus.svg";
import styled from "styled-components"; // 스타일시트 구성
import { GET_NOTES } from "../../queries"; // 노트 쿼리 구성을 불러온다.

const Header = styled.div`
	margin-bottom: 50px;
`;

const Title = styled.h1`
	font-size: 50px;
	font-weight: 600;
	margin: 0;
	margin-bottom: 30px;
	display: flex;
	align-items: center;
`;

const Button = styled.div`
	margin-left: 10px;
	transform: scale(0.8);
	background-color: #eee;
	display: flex;
	align-items: center;
	padding: 10px;
	border-radius: 10px;
	cursor: pointer;
`;

const Subtitle = styled.h2`
	color: #a2a19e;
	font-weight: 400;
`;

const Notes = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;

const Note = styled.div`
	padding: 10px;
	padding-left: 5px;
	transition: background-color 0.1s linear;
	cursor: pointer;
	border-radius: 5px;
	margin-bottom: 10px;
	&:hover {
		background-color: #eeeeee;
	}
`;

const NoteTitle = styled.span`
	padding-bottom: 5px;
	font-weight: 600;
	font-size: 20px;
`;

export default class NotesContainer extends React.Component {
	render() {
		return (
			<>
				<Header>
					<Title>
						Mins Notes
						<Link to={"/add"}>
							<Button>
								<Plus />
							</Button>
						</Link>
					</Title>
					<Subtitle>Taking notes while we learn.</Subtitle>
				</Header>
				<Notes>
					{/* 서버에 질의형식을 보내 노트 정보들을 가져온다 */}
					<Query query={GET_NOTES}>
						{({ data }) =>
							// data 로 들어온 노트들을 개별 id 로 title 을 펼쳐보여준다.
							data.notes
								? data.notes.map(note => (
										// Link 는 노트 경로, 키 값을 가지고 컴포넌트와 데이터를 유기적으로
										<Link to={`/note/${note.id}`} key={note.id}>
											<Note>
												<NoteTitle>{note.title}</NoteTitle>
											</Note>
										</Link>
								  ))
								: null
						}
					</Query>
				</Notes>
			</>
		);
	}
}
