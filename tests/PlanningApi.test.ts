import { login } from "../src/api/Session";
import { getScheduleDates } from "../src/utils/PlanningUtils";
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
    it("should get schedule dates from week number", async () => {
        const { startTimestamp, endTimestamp } = getScheduleDates(3);
        console.log(
            new Date(startTimestamp).toLocaleString(),
            new Date(endTimestamp).toLocaleString(),
        );
        expect(startTimestamp).toBeLessThan(endTimestamp);
    });
});
