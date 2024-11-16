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
