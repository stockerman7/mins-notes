import React from "react";
import { Query, Mutation } from "react-apollo";
import { GET_NOTE } from "../../queries";
import Editor from "../../Components/Editor";
import gql from "graphql-tag";

export const EDIT_NOTE = gql`
	mutation editNote($id: Int!, $title: String!, $content: String!) @client {
		editNote(id: $id, title: $title, content: $content) {
			id
		}
	}
`;

// 수정시 Editor 로 보내고 수정, 저장
export default class Edit extends React.Component {
	render() {
		const {
			match: {
				params: { id },
			},
		} = this.props;
		return (
			// Query id 로 데이터를 얻는다.
			<Query query={GET_NOTE} variables={{ id }}>
				{({ data }) =>
					data.note ? ( // data 유무를 판단
						// EDIT_NOTE 라는 Mutation 에 변경된 결과를 반환 받아 서버에서 수정해야하기 때문에 Mutation 요소로 감싼다.
						<Mutation mutation={EDIT_NOTE}>
							{editNote => {
								this.editNote = editNote; // editNote 변경 메소드
								// Editor 로 데이터 전달, Eidtor 에서 onSave 되면 -> this.editNote 수정이 이뤄짐
								return (
									<Editor
										id={data.note.id}
										title={data.note.title}
										content={data.note.content}
										onSave={this._onSave}
									/>
								);
							}}
						</Mutation>
					) : null
				}
			</Query>
		);
	}
	// 수정 저장
	_onSave = (title, content, id) => {
		const {
			history: { push },
		} = this.props;
		if (title !== "" && content !== "" && id) {
			// variables는 Query 실행에 필요한 모든 변수를 가지고 있는 객체다.
			this.editNote({ variables: { id, title, content } }); // Mutation 실행
			push("/"); // 업데이트된 Home 경로로 전환
		}
	};
}
