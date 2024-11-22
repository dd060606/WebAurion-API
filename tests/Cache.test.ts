import { login } from "../src/api/Session";
describe("CacheTests", () => {
    it("should test for function performance", async () => {
        const username = process.env.TEST_USERNAME;
        const password = process.env.TEST_PASSWORD;
        if (!username || !password) {
            throw new Error(
                "TEST_USERNAME or TEST_PASSWORD is not set in environment variables.",
            );
        }

        const session = await login(username, password);

        //Première fois sans le cache on récupère l'emploi du temps
        let start = performance.now();
        let planning = await session.getPlanningApi().fetchPlanning();
        let end = performance.now();
        let duration = end - start;
        console.log(`fetchPlanning (sans cache): ${duration.toFixed(2)} ms`);

        //Deuxième fois avec le cache on récupère l'emploi du temps
        start = performance.now();
        planning = await session.getPlanningApi().fetchPlanning();
        end = performance.now();
        duration = end - start;
        console.log(`fetchPlanning (avec cache): ${duration.toFixed(2)} ms`);

        //Première fois sans le cache on récupère les notes
        start = performance.now();
        let notes = await session.getNotesApi().fetchNotes();
        end = performance.now();
        duration = end - start;
        console.log(`fetchNotes (sans cache): ${duration.toFixed(2)} ms`);

        //Deuxième fois avec le cache on récupère les notes
        start = performance.now();
        notes = await session.getNotesApi().fetchNotes();
        end = performance.now();
        duration = end - start;
        console.log(`fetchNotes (avec cache): ${duration.toFixed(2)} ms`);

        // console.log("Le planning", JSON.stringify(planning));
        // console.log("Les notes ", JSON.stringify(notes));
        expect(notes).toBeInstanceOf(Array);
        expect(planning).toBeInstanceOf(Array);
    });
});
