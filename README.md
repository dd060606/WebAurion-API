# WebAurion API

**WebAurion API** est une bibliothèque Node.js écrite en TypeScript pour interagir avec l'API de WebAurion.  
Elle permet de récupérer facilement **les notes** et **l'emploi du temps** depuis le site WebAurion en utilisant seulement des requêtes HTTP.

---

## 📦 Installation

### 1. Prérequis

-   **Node.js** (version 16 ou supérieure recommandée)
-   **npm** ou **yarn**

### 2. Installation

Pour installer la bibliothèque dans votre projet, vous pouvez utiliser la commande suivante :

```bash
npm i webaurion-api
```

### 2. Utilisation en local avec `npm link`

Pour utiliser la bibliothèque dans un autre projet sans passer par un registre npm public :

1. Clonez ce dépôt :

    ```bash
    git clone https://github.com/dd060606/WebAurion-API.git
    cd WebAurion-API
    ```

2. Installez les dépendances :

    ```bash
    npm install
    ```

3. Compilez la bibliothèque :

    ```bash
    npm run build
    ```

4. Créez un lien global :

    ```bash
    npm link
    ```

5. Dans votre projet cible, ajoutez un lien vers la bibliothèque :

    ```bash
    npm link webaurion-api
    ```

# 🛠️ Fonctionnalités

-   **Récupération des notes :**

    Obtenez facilement vos notes via votre compte WebAurion.

-   **Récupération de l'emploi du temps :**

    Accédez à votre emploi du temps.

# 📘 Exemple d'utilisation

## 1. Importer la bibliothèque

Assurez-vous que la bibliothèque est installée ou liée (voir section **Installation**).

## 2. Récupérer l'emploi du temps

```typescript
import { login } from "webaurion-api";

//Le planning
async function fetchPlanning() {
    const username = "ENTRER VOTRE NOM D'UTILISATEUR";
    const password = "ENTRER VOTRE MOT DE PASSE";

    try {
        const session = await login(username, password);
        const planning = await session.getPlanningApi().fetchPlanning();

        console.log("Mon emploi du temps :", planning);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération de l'emploi du temps :",
            error,
        );
    }
}

fetchPlanning();
```

## 3. Récupérer les notes

```typescript
import { login, noteAverage } from "webaurion-api";

//Les notes
async function fetchNotes() {
    const username = "ENTRER VOTRE NOM D'UTILISATEUR";
    const password = "ENTRER VOTRE MOT DE PASSE";

    try {
        const session = await login(username, password);
        const notes = await session.getNotesApi().fetchNotes();

        console.log("Mes notes: ", JSON.stringify(notes, null, 2));
        console.log("Mes moyennes: ");
        notes.forEach((note) => {
            console.log(note.code + ": " + noteAverage(note.notes));
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des notes :", error);
    }
}

fetchNotes();
```

## 📋 Les Types

Les réponses des fonctions renvoient les données récupérées depuis WebAurion au format JSON pour faciliter leur utilisation.

### 🗓️ L'emploi du temps

L'utilisation de `session.getPlanningApi().fetchPlanning()` renvoie un tableau du type `PlanningEvent` qui représente un événement dans l'emploi du temps d'un utilisateur.

```typescript
type PlanningEvent = {
    id: string; // Identifiant unique de l'événement
    title: string; // Titre de l'événement
    subject: string; // La matière de l'événement (ex: "Mathématiques")
    room: string; // Salle de l'événement
    instructors: string; // Enseignants responsables de l'événement
    learners: string; // Étudiants inscrits à cet événement
    start: string; // Date et heure de début de l'événement
    end: string; // Date et heure de fin de l'événement
    className: string; // Nom de la classe associée (ex: "TP", "COURS")
};
```

**Exemple**:

```typescript
const exampleEvent: PlanningEvent = {
    id: "15447267",
    title: "Mathématiques S1",
    subject: "Mathématiques",
    room: "A2_46 ISEN_DP ROB",
    instructors: "Prof1 / Prof2",
    learners: "CIR1 / CEST1",
    start: "2024-11-19T08:00:00+0100",
    end: "2024-11-19T10:00:00+0100",
    className: "COURS",
};
```

### 📝 Les notes

L'utilisation de `session.getNotesApi().fetchNotes()` renvoie un tableau du type `NotesList` qui représente un ensemble de notes associées à un code de cours.

```typescript
type NotesList = {
    code: string; // Code du cours ou de l'évaluation
    notes: Note[]; // Liste des notes associées à ce code
};
type Note = {
    date: string; // Date de la note
    code: string; // Code du cours ou de l'évaluation
    subject: string; // Matière concernée
    note: string; // La note obtenue
    absence: string; // Absence (si applicable)
    description: string; // Appréciation de l'évaluation
    instructor: string; // Enseignant responsable de l'évaluation
};
```

**Exemple**:

```typescript
const exampleNotesList: NotesList = {
    code: "24_CIR1N_A1_S1_PHYSIQUE",
    notes: [
        {
            date: "02/10/2024",
            code: "24_CIR1N_A1_S1_PHYSIQUE",
            subject: "Physique DS1 S1",
            note: "13.00",
            absence: "",
            description: "",
            instructor: "Prof1",
        },
        {
            date: "13/11/2024",
            code: "24_CIR1N_A1_S1_PHYSIQUE",
            subject: "Physique DS2 S1",
            note: "17.00",
            absence: "",
            description: "",
            instructor: "Prof1",
        },
    ],
};
```

## 🧪 Tests avec Jest

Ce projet utilise [Jest](https://jestjs.io/) pour effectuer des tests unitaires et fonctionnels. Les tests se trouvent dans le répertoire `tests/`.
Vous pouvez vous inspirer du code dans les tests si besoin.

### 📂 Répertoire des tests

-   **`tests/NotesApi.test.ts`** : Tests pour les fonctionnalités liées à la récupération des notes.
-   **`tests/PlanningApi.test.ts`** : Tests pour les fonctionnalités liées à la récupération de l'emploi du temps.
-   **`tests/Session.test.ts`** : Tests pour la gestion des sessions utilisateur.
-   **`tests/Cache.test.ts`** : Tests pour la vitesse d'exécution des requêtes

### 🚀 Lancer les tests

```bash
npm test
```

## 🔧 Configuration du fichier `.env`

Pour utiliser correctement la bibliothèque et exécuter les tests, vous devez configurer un fichier `.env` pour stocker vos identifiants de connexion et autres variables sensibles.

### 📁 Fichier `.env`

Un fichier exemple est fourni dans le projet : `.env-example`. Voici les étapes pour le configurer :

1. **Copier le fichier exemple**  
   Dans le dossier racine du projet, créez un fichier `.env` à partir de l'exemple fourni :
    ```bash
    cp .env-example .env
    ```
2. **Remplir les valeurs**

    Ouvrez le fichier .env et complétez les informations nécessaires :

    ```env
    TEST_USERNAME=votre-identifiant
    TEST_PASSWORD=votre-mot-de-passe
    ```

-   `TEST_USERNAME` : L’identifiant WebAurion utilisé pour les tests.
-   `TEST_PASSWORD` : Le mot de passe correspondant.

⚠️ **Note** : Ces informations sont utilisées uniquement dans le cadre des tests et ne doivent pas être partagées publiquement.
