import { NOTE_FRAGMENT } from "./fragments";
import { GET_NOTES } from "./queries";

// graphql 기본적인 구성
export const defaults = {
	notes: [
		{
			__typename: "Note",
			id: 1,
			title: "First",
			content: "Second",
		},
	],
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

export const resolvers = {
	note: (_, variables, { cache, getCacheKey }) => {
		const id = cache.config.dataIdFromObject({
			__typename: "Note",
			id: variables.id,
		});
		const note = cache.readFragment({ fragment: NOTE_FRAGMENT, id });
		return note;
	},
	Mutation: {
		createNote: (_, variables, { cache }) => {
			const { notes } = cache.readQuery({ query: GET_NOTES });
			const { title, content } = variables;
			const newNote = {
				__typename: "Note",
				title,
				content,
				id: notes.length + 1,
			};
			cache.writeData({
				data: {
					notes: [newNote, ...notes],
				},
			});
			return newNote;
		},
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
			return updatedNote;
		},
	},
};
