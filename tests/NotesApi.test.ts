import { login } from "../src/api/Session";
describe("NotesApi", () => {
    it("should receive notes", async () => {
        const username = process.env.TEST_USERNAME;
        const password = process.env.TEST_PASSWORD;
        if (!username || !password) {
            throw new Error(
                "TEST_USERNAME or TEST_PASSWORD is not set in environment variables.",
            );
        }

        const session = await login(username, password);
        const schedule = await session.getNotesApi().fetchNotes();
        expect(schedule).not.toBeDefined();
    });
});
