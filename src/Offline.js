// #서버와의 단절이 생길시 localStorage 를 이용해 저장하고 다시 불러올 수 있어야한다.
import { GET_NOTES } from "./queries";

export const saveNotes = cache => {
	const { notes } = cache.readQuery({ query: GET_NOTES });
	const jsonNotes = JSON.stringify(notes);
	try {
		localStorage.setItem("notes", jsonNotes);
	} catch (error) {
		console.log(error);
	}
};

export const restoreNotes = () => {
	const notes = localStorage.getItem("notes");
	if (notes) {
		try {
			const parsedNotes = JSON.parse(notes);
			return parsedNotes;
		} catch (error) {
			console.log(error);
			return [];
		}
	}
	return [];
};
