# Stato del lavoro

Ultimo aggiornamento: 2026-10-31.

## Situazione attuale

- Prima applicazione locale implementata in React, Vite e TypeScript, con interfaccia e codice in inglese.
- Calendar, Groups, dettaglio gruppo e Profile collegati allo stesso stato.
- Creazione, modifica ed eliminazione di eventi, partecipazione, gruppi locali e profilo modificabile; calendario e statistiche derivati dagli stessi dati.
- Persistenza nel browser con validazione e gestione degli errori. Esempi fittizi iniziali; nessun database, account, autenticazione, invito reale o pubblicazione.
- Dipendenze installate esclusivamente dalla cache locale; `.npmrc` mantiene la modalità offline. Nessuna risorsa esterna caricata dall'app.
- Istruzioni operative e comandi nel `README.md`; decisioni D-002 e D-003 adottate.
- Git non ancora inizializzato nella cartella del progetto.

## Verifiche

Verifiche del 2026-10-31:

- 18 test della logica: date locali e bisestili, calendario completo, eventi su più giorni e in corso, statistiche, operazioni su eventi/gruppi/profilo, salvataggio e dati corrotti.
- 12 controlli di rendering senza browser: pagine, gruppo mancante, moduli, dettaglio evento e percorsi dell'applicazione.
- TypeScript e build di produzione verificati.
- Reinstallazione riproducibile dal file di lock verificata con `npm.cmd ci --offline --ignore-scripts --no-audit --no-fund --logs-dir .npm-logs`: 19 pacchetti ottenuti dalla cache locale, senza download.
- Server di sviluppo verificato con risposta HTTP 200 esclusivamente su `127.0.0.1`.
- Anteprima della build avviata correttamente su `127.0.0.1:4173`; file compilati collegati e presenti. Server di verifica arrestati al termine.
- Collegamenti locali Markdown, coerenza del lock, codifica UTF-8 e terminatori LF controllati.
- La verifica visiva e delle interazioni nel browser non è stata eseguita: il collegamento diretto al browser era indisponibile e il controllo automatico ha rifiutato l'uso di Chrome con “Computer Use was not approved to use Google Chrome”. Non è stato tentato di aggirare il rifiuto.

## Attività in corso

Nessuna.

## Impedimenti

Nessun impedimento per l'uso locale. Resta da svolgere la verifica visiva nel browser e delle interazioni reali, quando l'accesso sarà disponibile. Le integrazioni escluse dalla richiesta non sono impedimenti di questa fase.

## Ripresa del lavoro

Avviare con `npm.cmd run dev` e valutare insieme all'utente stile e flussi. Prima di cambiare servizi o modalità di persistenza, leggere i vincoli confermati in `PRODUCT.md`. Non avviare attività online o di pubblicazione.
