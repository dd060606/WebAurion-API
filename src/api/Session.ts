import axios, { AxiosInstance } from "axios";
import ScheduleApi from "./ScheduleApi";

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
