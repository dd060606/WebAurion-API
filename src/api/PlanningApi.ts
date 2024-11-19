import { getJSFFormParams, getViewState } from "../utils/AurionUtils";
import { planningResponseToEvents } from "../utils/PlanningUtils";
import Session from "./Session";

class PlanningApi {
    private session: Session;
    constructor(session: Session) {
        this.session = session;
    }

    // Récupération de l'emploi du temps en fonction de la date de début et de fin (timestamps en millisecondes)
    public fetchPlanning(startDate?: string): Promise<PlanningEvent[]> {
        return new Promise<PlanningEvent[]>(async (resolve, reject) => {
            try {
                const schedulePage = await this.session.sendGET<string>(
                    "/faces/Planning.xhtml",
                );
                let viewState = getViewState(schedulePage);
                if (viewState) {
                    // Ici 291906 correspond au menu 'Scolarité' dans la sidebar
                    // Requête utile pour intialiser le ViewState (obligatoire pour effectuer une requête)
                    await this.session.sendSidebarRequest("291906", viewState);

                    // Ici 1_4 correspond au sous-menu 'Emploi du temps' dans la sidebar
                    // On récupère le ViewState pour effectuer la prochaine requête
                    viewState = await this.session.sendSidebarSubmenuRequest(
                        "1_4",
                        viewState,
                    );

                    // On envoie enfin la requête pour obtenir l'emploi du temps
                    const params = getJSFFormParams(
                        "j_idt118",
                        "j_idt118",
                        viewState,
                    );
                    if (startDate) {
                        params.append("form:j_idt118_start", startDate);
                        // La date de fin est fixée à une semaine après la date de début
                        const endDate = startDate + 6 * 24 * 60 * 60 * 1000;
                        params.append("form:j_idt118_end", endDate);
                    } else {
                        const now = new Date();
                        // Obtenir le jour actuel (0 = dimanche, 1 = lundi, ..., 6 = samedi)
                        let day = now.getDay();
                        // Calculer la différence pour atteindre lundi (0 = dimanche => 1 jour pour atteindre lundi)
                        const daysToMonday = day === 0 ? 1 : 1 - day;
                        // Créer la date de début (lundi 6h00)
                        const startDate = new Date(now);
                        startDate.setDate(now.getDate() + daysToMonday); // Passer au lundi
                        startDate.setHours(6, 0, 0, 0); // Fixer à 6h00
                        // Date de fin (6 jours après la date de début)
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 6); // Ajouter 6 jours
                        // Convertir les dates en timestamp
                        const startTimestamp = startDate.getTime();
                        const endTimestamp = endDate.getTime();

                        params.append(
                            "form:j_idt118_start",
                            startTimestamp.toString(),
                        );
                        params.append(
                            "form:j_idt118_end",
                            endTimestamp.toString(),
                        );
                    }

                    const response = await this.session.sendPOST<string>(
                        "faces/Planning.xhtml",
                        params,
                    );
                    resolve(planningResponseToEvents(response));
                } else {
                    reject(new Error("Viewstate not found"));
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default PlanningApi;
