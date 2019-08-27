import React from "react";
import styled from "styled-components";
import MarkdownRenderer from "react-markdown-renderer";
import TextareaAutosize from "react-textarea-autosize";

// styled 에 TextareaAutosize 는 텍스트 영역에 스크롤이 생성하는 것을 방지한다.
const TitleInput = styled(TextareaAutosize)`
	font-size: 50px;
	font-weight: 600;
	width: 100%;
	&::placeholder {
		font-weight: 600;
	}
`;

const ContentPreview = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 50px;
`;

const ContentInput = styled(TextareaAutosize)`
	font-size: 18px;
	margin-top: 15px;
`;

const TitleContainer = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 50px;
`;

const Button = styled.button``;

export default class Editor extends React.Component {
	constructor(props) {
		super(props); // <Editor> 요소를 감싸는 부모측 요소 props 을 가져옴, 즉 부모는 <Mutation mutation={...}> 이다.
		// Editor 상태에 추가(초기값)/수정(이전 상태) 데이터를 담는다.
		this.state = {
			title: props.title || "",
			content: props.content || "",
			id: props.id || null,
		};
	}
	render() {
		const { title, content } = this.state;
		return (
			<>
				<TitleContainer>
					<TitleInput
						value={title}
						onChange={this._onInputChange}
						placeholder={"Untitled..."}
						name={"title"}
					/>
					<Button onClick={this._onSave}>Save</Button>
				</TitleContainer>
				<ContentPreview>
					<ContentInput
						value={content}
						onChange={this._onInputChange}
						placeholder={"# This supports markdown!"}
						name={"content"}
					/>
					{/* markdown 미리보기 */}
					<MarkdownRenderer markdown={content} className={"markdown"} />
				</ContentPreview>
			</>
		);
	}
	_onInputChange = event => {
		const {
			target: { value, name },
		} = event;
		this.setState({
			[name]: value,
		});
	};
	// Editor 객체에서 수정이 일어나면 그것을 저장, 즉 상태를 저장한다.
	_onSave = () => {
		const { onSave } = this.props; // Editor onSave prop 생성
		const { title, content, id } = this.state; // 상태 가져오기
		onSave(title, content, id); // Editor onSave prop 설정
	};
}
