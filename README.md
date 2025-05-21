<h2>1 - Projectbeschrijving en functionaliteiten:</h2>
**Projectbeschrijving:**
Deze webapplicatie is een interactieve Pokédex waarmee je Pokémon kunt doorzoeken, filteren, sorteren en opslaan als favoriet. 
Compatiebel met verschillende apparaten (desktop, tablet, mobiel). 
Gebruikers kunnen Pokémon bekijken in een lijstweergave of doorklikken naar een gedetailleerde pokemon profile.

Frontend: HTML, CSS, JavaScript
API: PokéAPI (voor Pokémon-gegevens op te halen)
Opslag: localStorage voor favorieten

**Functionaliteiten:**
  Zoeken naar een Pokémon op naam
  Sorteren op naam of nummer (ascending or descending)
  Filteren op type (zoals bv Fire, Water, Grass, etc.)
  Filteren op alleen favorieten
  Pokémon als favoriet markeren of verwijderen uit favorieten door op het hart te klikken
  De Pokemon profile openen van een Pokémon door op de kaart te klikken
  In de Pokemon profile:
    De shiny-versie tonen van de Pokémon
    Informatie bekijken zoals types, beschrijving, stats, lengte en gewicht
    De Pokémon als favoriet markeren
    De volgende Pokémon bekijken via een preview (of naar de profile gaan als je op de image klikt)
    Teruggaan naar de lijst
  Bladeren door de lijst van Pokémon 
  De webapp gebruiken op desktop, tablet of mobiel

<h2>2 - Gebruikte api's:</h2>
https://pokeapi.co/

<h2>5 - Screenshots:</h2>
See screenshots folder

<h2>6 - Bronnen:</h2>

https://www.w3schools.com/js/default.asp

**Claude.ai**
**Prompts:** I will give you some html, css and javascript code, and i want you to check the code for anything redundant or useless. If you find something, i want you to tell me where exactly you found it and why it is redundant or useless. 
           I want you to check the following javascript code for the following javascript concepts. If anything is missing, tell me where and how to add it without breaking the website. (This prompt didn't exactly work)
             Concepts:  DOM manipulatie:  
                        Elementen selecteren
                        Elementen manipuleren
                        Events aan elementen koppelen
                        Modern JavaScript:  
                        Gebruik van constanten
                        Template literals
                        Iteratie over arrays
                        Array methodes
                        Arrow functions
                        Conditional (ternary) operator (moderne if..else)
                        Callback functions
                        Promises
                        Async & Await
                        Observer API (1 is voldoende)
                        Data & API:  
                        Fetch om data op te halen
                        JSON manipuleren en weergeven
                        Opslag & validatie:  
                        Formulier validatie
                        Gebruik van LocalStorage 
                        Styling & layout:  
                        Basis HTML layout (flexbox of CSS grid kan hiervoor worden gebruikt)
                        Basis CSS
                        Gebruiksvriendelijke elementen (verwijderknoppen, icoontjes,...)
                        Tooling & structuur: 
                        Project is opgezet met Vite 
                        Een correcte folderstructuur wordt aangehouden (gescheiden html, css en js files, src folder, dist folder, ...)


**Chatgpt.com**
**Prompts:**
Hoe zou je het volgende project starten? Geef mij een stappenplan dat gemakkelijk te volgen is en duidelijk gestructureerd is. :

Projectoverzicht 
Voor het vak Advanced Web ga je een interactieve single-page webapplicatie bouwen die gebruik maakt van een API naar keuze. De applicatie moet gebruikers in staat stellen om data te verkennen, te filteren, te sorteren en op te slaan in persoonlijke collecties (favorieten). 

Jullie applicatie moet de volgende functies bevatten: 

Dataverzameling & -weergave:  
Haal data op van de API (API endpoint met minstens 20 op te halen objecten)
Toon de data op een visueel aantrekkelijke manier: lijst/tabel (+ kaart of andere visuele weergave naargelang API)
Zorg voor duidelijke details van de getoonde items (de lijstweergave toont minstens 6 kolommen)
Interactiviteit:  
Filter functionaliteit (op type, locatie, datum, etc.)
Zoekfunctie
Sorteermogelijkheden
Personalisatie:  
Gebruikers kunnen favoriete locaties/gebeurtenissen opslaan
Data wordt bewaard tussen sessies
Gebruikersvoorkeuren opslaan (we hebben tijdens de lessen aantal voorbeelden gezien zoals geolocatie, taalkeuze, themaswitcher, favorieten, gecachte API-data, ...) 
Gebruikerservaring:  
Responsive design
Visueel aantrekkelijke interface
Gebruiksvriendelijke navigatie 

(Ook gebruikt voor uit te zoeken hoedat ik bepaalde elementen van de api moest fetchen)
(Ook gebruikt om de readme file te maken)
