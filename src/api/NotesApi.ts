import {
    getJSFFormParams,
    getViewState,
    scheduleResponseToEvents,
} from "../utils/AurionUtils";
import Session from "./Session";

class NotesApi {
    private session: Session;
    constructor(session: Session) {
        this.session = session;
    }

    // Récupération des notes
    public fetchNotes(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const schedulePage = await this.session.sendGET<string>(
                    "/faces/LearnerNotationListPage.xhtml",
                );
                let viewState = getViewState(schedulePage);
                if (viewState) {
                    // Ici 291906 correspond au menu 'Scolarité' dans la sidebar
                    // Requête utile pour intialiser le ViewState (obligatoire pour effectuer une requête)
                    await this.session.sendSidebarRequest("291906", viewState);

                    // Ici 1_1 correspond au sous-menu 'Mes notes' dans la sidebar
                    // On récupère le ViewState pour effectuer la prochaine requête
                    viewState = await this.session.sendSidebarSubmenuRequest(
                        "1_1",
                        viewState,
                    );
                    const response = await this.session.sendGET<string>(
                        "faces/LearnerNotationListPage.xhtml",
                    );
                    console.log(response);
                    resolve();
                } else {
                    reject(new Error("Viewstate not found"));
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default NotesApi;
