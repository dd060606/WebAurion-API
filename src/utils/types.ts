type PlanningEvent = {
    id: string;
    title: string;
    subject: string;
    room: string;
    instructors: string;
    learners: string;
    start: string;
    end: string;
    className: string;
};
type Note = {
    date: string;
    code: string;
    subject: string;
    note: string;
    absence: string;
    description: string;
    instructor: string;
    [key: string]: string;
};
type NotesList = {
    code: string;
    notes: Note[];
};
