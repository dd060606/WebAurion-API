import { load } from "cheerio";
import { PlanningEvent } from "./types";

// Conversion du calendrier au format JSON
export function getJSONSchedule(xml: string): object {
    const parser = load(xml, {
        xmlMode: true,
    });
    const json = parser('update[id="form:j_idt118"]').text();
    return JSON.parse(json)["events"];
}

// On convertit la réponse du serveur XML en cours du planning
export function planningResponseToEvents(response: string): PlanningEvent[] {
    const json: any = getJSONSchedule(response);

    return json.map((event: any) => {
        // On récupère les informations des cours
        const eventInfo = event.title.split(" - ");

        let room = eventInfo[1].trim();
        // Pour les matières qui ne sont pas bien formatées par défaut...
        let subject = "";
        let title = "";
        if (eventInfo.length >= 9) {
            subject = eventInfo[eventInfo.length - 6].trim();
            title = eventInfo[eventInfo.length - 4].trim();
        } else {
            subject = eventInfo[eventInfo.length - 4].trim();
            title = eventInfo[eventInfo.length - 3].trim();
        }

        let instructors = eventInfo[eventInfo.length - 2].trim();
        let learners = eventInfo[eventInfo.length - 1].trim();

        return {
            id: event.id,
            title,
            subject,
            room,
            instructors,
            learners,
            start: event.start,
            end: event.end,
            className: event.className,
        };
    });
}
