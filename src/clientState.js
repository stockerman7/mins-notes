import { NOTE_FRAGMENT } from "./fragments";
import { GET_NOTES } from "./queries";
import { saveNotes, restoreNotes } from "./Offline";

// graphql 기본적인 구성
// client 로컬 저장소 대한 초기 상태, 이전 저장소 목록 조회(여기선 캐시)
export const defaults = {
	notes: restoreNotes(),
};
// schema, query, mutation type 정의
export const typeDefs = [
	`
    schema {
        query: Query
        mutation: Mutation
    }
    type Query {
        notes: [Note]!
        note(id: Int!): Note
    }
    type Mutation{
        createNote(title: String!, content: String!) : Note
        editNote(id: Int!, title: String, content:String): Note
    }
    type Note{
        id: Int!
        title: String!
        content: String!
    }
    `,
];

// 로컬 데이터를 접근하려면 GraphQL로 Query 해야한다.
// 동일한 Query를 로컬, 서버에 동시 요청할 수도 있다.
export const resolvers = {
	note: (_, variables, { cache, getCacheKey }) => {
		// dataIdFromObject은 고유 식별자에 대한 'getter' 동작이다.(수동으로 사용자 지정)
		// 예를들어 같은 ID가 다른 타입에도 존재할 경우 구분을 위해 __typename을 포함시킬 수 있음
		const id = cache.config.dataIdFromObject({
			__typename: "Note",
			id: variables.id,
		});
		// readQuery VS readFragment
		// readQuery는 root 쿼리 유형의 데이터만 읽기가 가능하지만
		// 'readFrangment' 는 모든 노드의 데이터를 읽는다.(캐시 데이터 유연성을 향상, 없으면 null 반환)
		const note = cache.readFragment({ fragment: NOTE_FRAGMENT, id }); // id 는 dataIdFromObject 함수가 반환 한 값
		return note;
	},
	Mutation: {
		// 노트 생성, 여기서 variables는 Query가 호출된 변수를 포함하는 객체다.
		// createNote 는 { title, content } 두개의 객체를 받는다.
		createNote: (_, variables, { cache }) => {
			// readQuery 는 캐시 데이터를 Query 한다(캐시 읽기, root 쿼리 유형의 데이터만, 없으면 오류 발생)
			// 이것은 다른말로 GraphQL 서버에는 요청하지 않는다. 읽은 데이터는 Query 형태로 반환됨
			const { notes } = cache.readQuery({ query: GET_NOTES });
			const { title, content } = variables;
			const newNote = {
				__typename: "Note",
				title,
				content,
				id: notes.length + 1,
			};
			// 캐시에 새로운 데이터 정보를 추가
			cache.writeData({
				data: {
					notes: [newNote, ...notes],
				},
			});
			saveNotes(cache);
			return newNote;
		},
		// 노트 수정
		editNote: (_, { id, title, content }, { cache }) => {
			const noteId = cache.config.dataIdFromObject({
				__typename: "Note",
				id,
			});
			const note = cache.readFragment({ fragment: NOTE_FRAGMENT, id: noteId });
			const updatedNote = {
				...note,
				title,
				content,
			};
			cache.writeFragment({
				id: noteId,
				fragment: NOTE_FRAGMENT,
				data: updatedNote,
			});
			saveNotes(cache);
			return updatedNote;
		},
	},
};
