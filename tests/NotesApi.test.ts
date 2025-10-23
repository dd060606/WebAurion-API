import Session from "../src/api/Session";
import { noteAverage } from "../src/utils/NotesUtils";
describe("NotesApi", () => {
    it("should receive notes", async () => {
        const username = process.env.TEST_USERNAME;
        const password = process.env.TEST_PASSWORD;
        if (!username || !password) {
            throw new Error(
                "TEST_USERNAME or TEST_PASSWORD is not set in environment variables.",
            );
        }

        const session = new Session();
        await session.login(username, password);

        const notes = await session.getNotesApi().fetchNotes();
        console.log(JSON.stringify(notes, null, 2));
        console.log("Les moyennes: ");
        notes.forEach((note) => {
            console.log(note.code + ": " + noteAverage(note.notes));
        });
        expect(notes).toBeInstanceOf(Array);
    });
});
