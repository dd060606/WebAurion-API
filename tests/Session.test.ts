import Session from "../src/api/Session";
describe("AuthApi", () => {
    it("should log in a user and receive a session", async () => {
        const username = process.env.TEST_USERNAME;
        const password = process.env.TEST_PASSWORD;
        if (!username || !password) {
            throw new Error(
                "TEST_USERNAME or TEST_PASSWORD is not set in environment variables.",
            );
        }

        const session = new Session();
        await session.login(username, password);

        expect(session).toBeDefined();
    });
});
