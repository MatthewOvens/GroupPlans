# Contesto del prodotto

## Idea

Una webapp che faccia da planner per gruppi di amici.

Il contesto comprende sia vacanze di più giorni sia eventi di un solo giorno, come concerti. Questi esempi servono a orientare il lavoro futuro; non definiscono ancora flussi, schermate o funzionalità.

## Indicazioni confermate

- Destinatari: gruppi di amici.
- Ambito: pianificazione di vacanze ed eventi.
- Preferenza iniziale: un progetto semplice, senza complessità superflua.
- Prima versione funzionante autorizzata il 2026-10-31, con libertà stilistica.
- Interfaccia e codice in inglese.
- Tre sezioni: Calendar, Groups e Profile.
- Calendar: eventi dell'utente distinti per gruppo.
- Groups: lista dei gruppi di appartenenza; dettaglio di ogni gruppo con prossimi eventi in pianificazione e creazione di nuovi eventi.
- Profile: profilo personale e statistiche sugli eventi passati e futuri.
- Solo lavoro locale: nessun accesso online, account creato, database o pubblicazione.
- Fermarsi prima di attività che richiedano credenziali o un intervento umano; non chiedere conferme per creare le pagine già autorizzate.

## Perimetro della prima versione

Le seguenti scelte di comportamento sono state adottate per rendere utilizzabile la base autorizzata; potranno essere riviste:

- Profilo e gruppi fittizi iniziali, con dati salvati nel browser.
- Calendario mensile, agenda, filtri per gruppo e selezione di un giorno.
- Eventi di uno o più giorni, con nome, gruppo, categoria, date, ora facoltativa, luogo facoltativo, note e stato di pianificazione o conferma.
- Creazione, modifica ed eliminazione con conferma degli eventi; chi crea un evento partecipa inizialmente e può cambiare la propria partecipazione.
- Nuovi gruppi locali con nome, descrizione, colore e utente corrente come primo membro.
- Profilo modificabile e statistiche calcolate dai dati effettivi: eventi futuri e passati a cui l'utente partecipa, più numero di gruppi.
- Gli eventi terminati prima della data locale odierna sono passati; quelli di oggi o ancora in corso restano tra i futuri/in corso. La separazione è per giorno, senza una gestione di fusi orari tra utenti.
- Collaborazione tra utenti, inviti e autenticazione restano fuori da questa versione. I commenti nel codice identificano il punto di integrazione futura senza inizializzare servizi.

## Da definire quando necessario

- Il nome definitivo del prodotto; "Group Plans" è un nome di lavoro ricavato dalla cartella del progetto.
- I primi riscontri sull'aspetto visivo e sui flussi della versione locale.
- Ruoli, inviti, autenticazione e regole di collaborazione reali, se richiesti in futuro.
- Eventuali servizi di persistenza e requisiti di pubblicazione, solo dopo una nuova autorizzazione.
- Date e orari per utenti in fusi diversi, se diventeranno necessari.

Questi punti sono domande aperte, non attività già approvate né vincoli impliciti.
