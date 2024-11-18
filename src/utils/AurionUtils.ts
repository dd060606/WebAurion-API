import { load } from "cheerio";

// Extraction du ViewState de la page HTML (obligatoire pour effectuer une requête)
export function getViewState(html: string): string | undefined {
    const parser = load(html);
    //On recherche l'élément input avec l'attribut name="javax.faces.ViewState"
    const inputElement = parser('input[name="javax.faces.ViewState"]');

    if (inputElement.length > 0) {
        //On récupère la valeur de l'attribut value
        const viewState = inputElement.attr("value");
        return viewState;
    }
    return undefined;
}

// Conversion du calendrier au format JSON
export function getJSONSchedule(xml: string): object {
    const parser = load(xml, {
        xmlMode: true,
    });
    const json = parser('update[id="form:j_idt118"]').text();
    return JSON.parse(json)["events"];
}

// On convertit la réponse du serveur XML en cours du planning
export function scheduleResponseToEvents(response: string): ScheduleEvent[] {
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

// Paramètres nécessaires pour effectuer une requête avec le backend Java Server Faces (JSF)
// Form ID : ID du formulaire (Récupérable avec BurpSuite / Inspecteur de requêtes)
// Render ID : ID de l'élément à mettre à jour (Récupérable avec BurpSuite / Inspecteur de requêtes)
export function getJSFFormParams(
    formId: string,
    renderId: string,
    viewState: string,
): URLSearchParams {
    const params = new URLSearchParams();
    params.append("javax.faces.partial.ajax", "true");
    params.append("javax.faces.source", `form:${formId}`);
    params.append("javax.faces.partial.execute", `form:${formId}`);
    params.append("javax.faces.partial.render", `form:${renderId}`);
    params.append(`form:${formId}`, `form:${formId}`);
    params.append("form", "form");
    params.append("javax.faces.ViewState", viewState);
    return params;
}
