import {
    getJSFFormParams,
    getViewState,
    scheduleResponseToEvents,
} from "../utils/AurionUtils";
import Session from "./Session";

class ScheduleApi {
    private session: Session;
    constructor(session: Session) {
        this.session = session;
    }

    // Récupération de l'emploi du temps en fonction de la date de début et de fin (timestamps en millisecondes)
    public fetchSchedule(
        startDate?: string,
        endDate?: string,
    ): Promise<ScheduleEvent[]> {
        return new Promise<ScheduleEvent[]>(async (resolve, reject) => {
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
                    if (startDate && endDate) {
                        params.append("form:j_idt118_start", startDate);
                        params.append("form:j_idt118_end", endDate);
                    } else {
                        // On récupère le timestamp du lundi de la semaine en cours
                        const currentDate = new Date();
                        const currentDay = currentDate.getDay();
                        const daysUntilMonday =
                            (currentDay === 0 ? 1 : 8) - currentDay;
                        currentDate.setDate(
                            currentDate.getDate() + daysUntilMonday,
                        );
                        currentDate.setHours(0, 0, 0, 0);
                        const startTimestamp = currentDate.getTime();
                        const endTimestamp =
                            startTimestamp + 6 * 24 * 60 * 60 * 1000;
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
                    resolve(scheduleResponseToEvents(response));
                } else {
                    reject(new Error("Viewstate not found"));
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default ScheduleApi;
