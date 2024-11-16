import { getJSONSchedule, getViewState } from "../utils/AurionUtils";
import Session from "./Session";

class ScheduleApi {
    private session: Session;
    constructor(session: Session) {
        this.session = session;
    }

    public fetchSchedule(): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const schedulePage = await this.session.sendGET<string>(
                    "/faces/Planning.xhtml",
                );
                let viewState = getViewState(schedulePage);
                if (viewState) {
                    const params = new URLSearchParams();
                    // On ajoute les paramètres nécessaires pour effectuer une requête POST
                    params.append("javax.faces.partial.ajax", "true");
                    params.append("javax.faces.source", "form:j_idt46");
                    params.append(
                        "javax.faces.partial.execute",
                        "form:j_idt46",
                    );
                    params.append("javax.faces.partial.render", "form:sidebar");
                    params.append("form:j_idt46", "form:j_idt46");
                    params.append(
                        "webscolaapp.Sidebar.ID_SUBMENU",
                        "submenu_291906",
                    );
                    params.append("form", "form");
                    params.append("javax.faces.ViewState", viewState);
                    const response = await this.session.sendPOST<string>(
                        "faces/Planning.xhtml",
                        params,
                    );

                    const params2 = new URLSearchParams();
                    // On ajoute les paramètres nécessaires pour effectuer une requête POST
                    params2.append("form", "form");
                    params2.append("javax.faces.ViewState", viewState);
                    params2.append("form:sidebar", "form:sidebar");
                    params2.append("form:sidebar_menuid", "1_4");
                    const response2 = await this.session.sendPOST<string>(
                        "faces/Planning.xhtml",
                        params2,
                    );
                    viewState = getViewState(response2);
                    if (!viewState) {
                        return reject(new Error("Viewstate not found"));
                    }
                    const params3 = new URLSearchParams();
                    params3.append("javax.faces.partial.ajax", "true");
                    params3.append("javax.faces.source", "form:j_idt118");
                    params3.append(
                        "javax.faces.partial.execute",
                        "form:j_idt118",
                    );
                    params3.append(
                        "javax.faces.partial.render",
                        "form:j_idt118",
                    );
                    params3.append("form:j_idt118", "form:j_idt118");
                    params3.append("form:j_idt118_start", "1731279600000");
                    params3.append("form:j_idt118_end", "1731798000000");
                    params3.append("form", "form");
                    params3.append(
                        "form:idInit",
                        "webscolaapp.Planning_-6802915683822110557",
                    );
                    params3.append("javax.faces.ViewState", viewState);
                    const response3 = await this.session.sendPOST<string>(
                        "faces/Planning.xhtml",
                        params3,
                    );
                    console.log(getJSONSchedule(response3));
                    resolve(response2);
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
