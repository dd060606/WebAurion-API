import { login } from "../src/api/Session";
describe("ScheduleApi", () => {
    it("should receive a schedule", async () => {
        const username = process.env.TEST_USERNAME;
        const password = process.env.TEST_PASSWORD;
        if (!username || !password) {
            throw new Error(
                "TEST_USERNAME or TEST_PASSWORD is not set in environment variables.",
            );
        }

        const session = await login(username, password);
        const schedule = await session.getScheduleApi().fetchSchedule();
        expect(schedule).toBeInstanceOf(Array);
    });
});
