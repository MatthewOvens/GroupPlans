# Decisioni

Registrare qui soltanto decisioni durevoli effettivamente adottate, distinguendo le richieste dell'utente dalle scelte tecniche motivate dell'agente. Le opzioni ancora da valutare restano questioni aperte nel documento pertinente e non diventano decisioni per il solo fatto di essere menzionate.

## D-001 — Preparazione documentale senza implementazione

- Stato: superata da D-002 per l'avvio dello sviluppo locale.
- Data: 2026-10-29.
- Origine: richiesta iniziale dell'utente.
- Decisione: creare solo la struttura documentale utile agli agenti, senza funzionalità o codice applicativo.
- Motivazione: preparare il contesto di lavoro prima di avviare lo sviluppo.
- Conseguenze: stack, architettura, dipendenze e funzionalità restano da definire; non vengono creati scaffolding applicativi o configurazioni di servizi.
- Ambito temporale: fase preparatoria iniziale. Una successiva richiesta esplicita di sviluppo consente di procedere nel suo perimetro; aggiornare questa voce come superata e collegare la nuova decisione quando cambia la fase.

## D-002 — Prima applicazione React locale

- Stato: adottata.
- Data: 2026-10-31.
- Origine: richiesta esplicita dell'utente di iniziare la prima versione dopo il confronto su React con Vite; scelte tecniche dell'agente entro questo ambito.
- Decisione: React con Vite e TypeScript; una sola applicazione con stato condiviso, navigazione tramite hash e CSS locale. Le tre sezioni richieste e il comportamento della prima versione sono descritti in `PRODUCT.md`.
- Motivazione: fornire una base funzionante con poche dipendenze, senza richiedere server applicativi o servizi esterni. Le dipendenze sono state ricavate esclusivamente dalla cache disponibile, con versioni fissate e file di lock.
- Versioni iniziali: React 18.3.1, Vite 5.0.10, TypeScript 5.9.3. Non sono state ricercate o scaricate altre versioni, in conformità al divieto di accesso online.
- Conseguenze: componenti React, logica sui dati e persistenza sono separati. Un eventuale passaggio a Next.js resta una scelta futura, non è un'attività programmata. Il nome Group Plans rimane provvisorio.

## D-003 — Persistenza nel browser e assenza di integrazioni

- Stato: adottata.
- Data: 2026-10-31.
- Origine: vincoli espliciti dell'utente su lavoro offline, account, database e pubblicazione; scelta tecnica dell'agente per rendere provabili i flussi.
- Decisione: dati fittizi iniziali e persistenza nel `localStorage`, con validazione, avvisi in caso di errore e ripristino esplicito degli esempi. Nessun client remoto o credenziale. Il punto di sostituzione della persistenza è commentato in `src/lib/storage.ts`.
- Motivazione: permettere di creare e modificare piani senza un database e mantenere le modifiche dopo un ricaricamento, quando il browser lo consente.
- Conseguenze: i dati appartengono a quel browser e a quell'origine; non c'è collaborazione reale. `.npmrc` forza le installazioni offline; l'app non include font, immagini o chiamate applicative esterne. Server di sviluppo e anteprima sono limitati a `127.0.0.1`.

## Formato per le prossime decisioni

Per ogni nuova decisione indicare identificativo progressivo, titolo, stato (adottata o superata), data, origine, decisione, motivazione e conseguenze. Per l'origine specificare se si tratta di una richiesta dell'utente o di una scelta tecnica dell'agente. Se una decisione viene sostituita, collegare quella nuova e conservare la precedente per contesto.
