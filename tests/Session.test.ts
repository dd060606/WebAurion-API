import { login } from "../src/api/Session";
describe("AuthApi", () => {
    it("should log in a user and receive a session", async () => {
        const username = process.env.TEST_USERNAME;
        const password = process.env.TEST_PASSWORD;
        if (!username || !password) {
            throw new Error(
                "TEST_USERNAME or TEST_PASSWORD is not set in environment variables.",
            );
        }

        const result = await login(username, password);
        expect(result).toBeDefined();
    });
});
