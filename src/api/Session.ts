import axios, { AxiosInstance } from "axios";
import ScheduleApi from "./ScheduleApi";
import { getJSFFormParams, getViewState } from "../utils/AurionUtils";
import NotesApi from "./NotesApi";

class Session {
    private client: AxiosInstance;

    constructor(baseURL: string, token: string) {
        this.client = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie: `JSESSIONID=${token}`,
            },
        });
    }

    // API pour le calendrier
    public getScheduleApi(): ScheduleApi {
        return new ScheduleApi(this);
    }
    // API pour les notes
    public getNotesApi(): NotesApi {
        return new NotesApi(this);
    }

    // (1ère phase) Besoin de simuler le clic sur la sidebar pour obtenir le ViewState nécessaire aux fonctionnements des reqûetes
    public sendSidebarRequest(
        subMenuId: string,
        viewState: string,
    ): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                // 1 ère sidebar: formId = j_idt46, renderId = sidebar
                const params = getJSFFormParams(
                    "j_idt46",
                    "sidebar",
                    viewState,
                );
                // On ajoute l'ID du sous-menu qui correspond à la rubrique chosie (Scolarité, mon compte, divers, ...)
                params.append(
                    "webscolaapp.Sidebar.ID_SUBMENU",
                    `submenu_${subMenuId}`,
                );
                // On envoie la requête POST
                const response = await this.sendPOST<string>(
                    `faces/Planning.xhtml`,
                    params,
                );
                resolve(response);
            } catch (err) {
                reject(err);
            }
        });
    }

    // (2ème phase) Simulation du sous menu de la side bar pour obtenir le ViewState nécessaire aux fonctionnements des requêtes
    // Cette fonction retourne un second ViewState qui sera utilisé pour effectuer les prochaines requêtes POST
    public sendSidebarSubmenuRequest(
        subMenuId: string,
        viewState: string,
    ): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const params = new URLSearchParams();
                // On ajoute les paramètres nécessaires pour effectuer une requête POST
                params.append("form", "form");
                params.append("javax.faces.ViewState", viewState);
                params.append("form:sidebar", "form:sidebar");
                params.append("form:sidebar_menuid", subMenuId);
                const response = await this.sendPOST<string>(
                    `faces/Planning.xhtml`,
                    params,
                );
                const secondViewState = getViewState(response);
                if (secondViewState) {
                    resolve(secondViewState);
                } else {
                    reject(new Error("Viewstate not found"));
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    public sendGET<T>(url: string): Promise<T> {
        return this.client.get<T>(url).then((response) => response.data);
    }

    public sendPOST<T>(url: string, data: unknown): Promise<T> {
        return this.client.post<T>(url, data).then((response) => response.data);
    }
}

/**
 * Authentifie un utilisateur avec un nom d'utilisateur et un mot de passe.
 *
 * @param {string} username - Le nom d'utilisateur de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @returns {Promise<Session>} Une promesse qui se résout avec une instance de Session si l'authentification réussit.
 * @throws {Error} Si l'authentification échoue.
 */
export function login(username: string, password: string): Promise<Session> {
    const baseURL = "https://web.isen-ouest.fr/webAurion";
    return new Promise<Session>((resolve, reject) => {
        const params = new URLSearchParams();
        params.append("username", username);
        params.append("password", password);
        axios
            .post(`${baseURL}/login`, params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                maxRedirects: 0,
            })
            .then((response) => {
                //Si la réponse est 302 et que le cookie est défini alors on retourne une nouvelle session
                if (response.status === 302 && response.headers["set-cookie"]) {
                    const token = response.headers["set-cookie"][0]
                        .split(";")[0]
                        .split("=")[1];
                    resolve(new Session(baseURL, token));
                } else {
                    reject(new Error("Login failed."));
                }
            })
            .catch((err) => {
                //Si la réponse est 302 et que le cookie est défini alors on retourne une nouvelle session
                if (err.response && err.response.status === 302) {
                    const token = err.response.headers["set-cookie"][0]
                        .split(";")[0]
                        .split("=")[1];
                    resolve(new Session(baseURL, token));
                } else {
                    reject(new Error("Login failed."));
                }
            });
    });
}

export default Session;
