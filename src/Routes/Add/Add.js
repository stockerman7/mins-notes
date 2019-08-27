import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Editor from "../../Components/Editor";

const ADD_NOTE = gql`
	# clientState.js 에서 설정한 resolvers -> Mutation : { createNote: ... } -> 추가된 id를 받는다.
	# @client 설정은 GraphQL이 서버로 데이터를 전송하지 않고 로컬 캐시에 전송한다.
	mutation createNote($title: String!, $content: String!) @client {
		createNote(title: $title, content: $content) {
			id
		}
	}
`;

export default class Add extends React.Component {
	render() {
		return (
			<Mutation mutation={ADD_NOTE}>
				{/* mutation resolvers 설정에서 createNote 메소드를 가져와 Editor onSave prop으로 전달한다.
				Editor 객체 측에서 수정이 생기면 상태 저장/업데이트 */}
				{createNote => {
					this.createNote = createNote;
					return <Editor onSave={this._onSave} />;
				}}
			</Mutation>
		);
	}

	_onSave = (title, content) => {
		// 기존 history 를 가져온다(업데이트 전 상태) -> 업데이트된 후 상태로 전환을 위해
		const {
			history: { push },
		} = this.props;
		if (title !== "" && content !== "") {
			// { variables : {...} } 처럼 객체로 전달하는 이유는 받는 쪽에서 같은 이름의 param으로 받아 설정하기 때문이다.
			this.createNote({ variables: { title, content } });
			push("/"); // 업데이트된 Home 경로로 전환
		}
	};
}
