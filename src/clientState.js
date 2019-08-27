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
		const id = cache.config.dataIdFromObject({
			__typename: "Note",
			id: variables.id,
		});
		// 재사용 가능한 fragment 요소를 사용해 캐시를 읽는다.
		const note = cache.readFragment({ fragment: NOTE_FRAGMENT, id });
		return note;
	},
	Mutation: {
		// 노트 생성, 여기서 variables는 Query가 호출된 변수를 포함하는 객체다.
		// createNote 는 { title, content } 두개의 객체를 받는다.
		createNote: (_, variables, { cache }) => {
			// readQuery, readFragment의 차이는 재사용 여부에 있다. 여기선 최초로 생성하는 것이기 때문에 readQuery를 사용한다.
			// 생성 이후 readFragment 를 사용해 재사용한다.
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
