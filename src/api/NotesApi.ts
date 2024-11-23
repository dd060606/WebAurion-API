import { getViewState } from "../utils/AurionUtils";
import { getNotesFromResponse } from "../utils/NotesUtils";
import { NotesList } from "../utils/types";
import Session from "./Session";

class NotesApi {
    private session: Session;
    constructor(session: Session) {
        this.session = session;
    }

    // Récupération des notes
    public fetchNotes(): Promise<NotesList[]> {
        return new Promise<NotesList[]>(async (resolve, reject) => {
            try {
                // On initialise le ViewState (obligatoire pour avoir une réponse correcteur du backend)
                // Ici 1_1 correspond au sous-menu 'Mes notes' dans la sidebar
                await this.session.getViewState("1_1");
                const response = await this.session.sendGET<string>(
                    "faces/LearnerNotationListPage.xhtml",
                );
                resolve(getNotesFromResponse(response));
            } catch (error) {
                // En cas d'erreur, on supprime le cache de ViewState
                this.session.clearViewStateCache();
                reject(error);
            }
        });
    }
}

export default NotesApi;
