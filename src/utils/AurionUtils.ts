import { JSDOM } from "jsdom";

// Extraction du ViewState de la page HTML (obligatoire pour effectuer une requête)
export function getViewState(html: string): string | undefined {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const inputElement = document.querySelector(
        'input[name="javax.faces.ViewState"]',
    );

    if (inputElement) {
        return inputElement.getAttribute("value") || undefined;
    }
    return undefined;
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
