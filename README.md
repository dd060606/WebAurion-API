# WebAurion API

**WebAurion API** est une bibliothèque Node.js écrite en TypeScript pour interagir avec l'API de WebAurion.  
Elle permet de récupérer facilement **les notes** et **l'emploi du temps** depuis le site WebAurion.

---

## 📦 Installation

### 1. Prérequis

-   **Node.js** (version 16 ou supérieure recommandée)
-   **npm** ou **yarn**

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
