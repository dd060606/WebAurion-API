import { JSDOM } from "jsdom";
import { Note, NotesList } from "./types";

export function getNotesFromResponse(htmlReponse: string): NotesList[] {
    const dom = new JSDOM(htmlReponse);
    const document = dom.window.document;
    const table = document.querySelector("table tbody");
    const notes: Note[] = [];

    if (table) {
        table.querySelectorAll("tr").forEach((row) => {
            const note: Note = {
                date: "",
                code: "",
                subject: "",
                note: "",
                absence: "",
                description: "",
                instructor: "",
            };
            const fields = [
                "date",
                "code",
                "subject",
                "note",
                "absence",
                "description",
                "instructor",
            ];
            row.querySelectorAll("td").forEach((cell, index) => {
                let value = cell.textContent?.trim() || "";
                if (index === 1) {
                    value = value.replace(/_DS\d$/, "");
                }
                note[fields[index]] = value;
            });
            notes.push(note);
        });
    }

    const notesByCode: NotesList[] = [];
    notes.forEach((note) => {
        const code = note.code;
        const existingNote = notesByCode.find((n) => n.code === code);
        if (existingNote) {
            existingNote.notes.push(note);
        } else {
            notesByCode.push({
                code,
                notes: [note],
            });
        }
    });

    return notesByCode;
}

// On calcule la moyenne d'une liste de notes
export function noteAverage(note: Note[]): number {
    let sum = 0;
    let count = 0;
    note.forEach((n) => {
        if (n.note !== "") {
            sum += parseFloat(n.note);
            count++;
        }
    });
    return sum / count;
}
