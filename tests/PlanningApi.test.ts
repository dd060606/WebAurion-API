import { login } from "../src/api/Session";
describe("PlanningApi", () => {
    it("should receive a planning", async () => {
        const username = process.env.TEST_USERNAME;
        const password = process.env.TEST_PASSWORD;
        if (!username || !password) {
            throw new Error(
                "TEST_USERNAME or TEST_PASSWORD is not set in environment variables.",
            );
        }

        const session = await login(username, password);
        const planning = await session.getPlanningApi().fetchPlanning();
        console.log(planning);
        expect(planning).toBeInstanceOf(Array);
    });
});
