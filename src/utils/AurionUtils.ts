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

// Récupération du prénom / nom de l'utilisateur lors de la connexion
export function getName(html: string): string {
    const parser = load(html);
    //On recherche de l'élément qui contient le prénom et le nom
    const usernameElement = parser("li.ui-widget-header > h3");
    if (usernameElement.length > 0) {
        //On récupère le texte contenu dans l'élément
        const username = usernameElement.text();
        return username;
    }
    return "";
}

/**
 * Extrait le sidebar_menuid correspondant à un texte donné dans le menu.
 * @param {string} html - Le contenu HTML à parser
 * @param {string} label - Le texte du menu à rechercher (ex: "Mon planning" ou "Mes notes")
 * @returns {string|null} Le sidebar_menuid correspondant, ou null si non trouvé
 */
export function getSidebarMenuId(html: string, label: string): string | null {
    const parser = load(html);

    // Cherche le span dont le texte commence par `label`
    const span = parser("span.ui-menuitem-text")
        .filter((_, el) => {
            const text = parser(el).text().trim();
            return text.startsWith(label);
        })
        .first();

    if (!span.length) {
        // Non trouvé
        return null;
    }

    // Trouve l’attribut onclick du lien parent
    const onclick = span.closest("a").attr("onclick");
    if (!onclick) {
        // Non trouvé
        return null;
    }

    // Extrait la valeur form:sidebar_menuid:'X_Y'
    const match = onclick.match(/'form:sidebar_menuid':'([^']+)'/);
    return match ? match[1] : null;
}
