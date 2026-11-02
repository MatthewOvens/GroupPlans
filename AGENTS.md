# Istruzioni per gli agenti

## Contesto

Group Plans è il nome di lavoro, ricavato dalla cartella del progetto, di una webapp pensata per aiutare gruppi di amici a pianificare vacanze di più giorni ed eventi di un solo giorno, come concerti. Il nome del prodotto non è stato confermato.

Queste istruzioni si applicano a tutta la cartella del progetto. Leggere prima [README.md](README.md), poi [il contesto del prodotto](docs/PRODUCT.md), [le decisioni](docs/DECISIONS.md) e [lo stato del lavoro](docs/STATUS.md).

## Perimetro attuale

- È presente una prima webapp locale in React, Vite e TypeScript. Il perimetro confermato è in `docs/PRODUCT.md`; le scelte tecniche sono in `docs/DECISIONS.md`.
- La richiesta del 2026-10-31 autorizza pagine e logica di base. Non chiedere una seconda conferma per generare o modificare le pagine entro questo ambito.
- Non accedere online, creare account, introdurre database o pubblicare il progetto. Fermarsi prima di attività che richiedano credenziali o un intervento umano.
- Usare esclusivamente dipendenze già disponibili in locale e comandi offline. Non rimuovere `.npmrc` per aggirare un'installazione non riuscita.
- Gli ampliamenti futuri richiedono una richiesta pertinente; non considerare le questioni aperte requisiti impliciti.

## Dove mantenere le informazioni

- `README.md`: orientamento, mappa dei file e, quando esisteranno, istruzioni di avvio verificate.
- `docs/PRODUCT.md`: contesto, requisiti confermati e questioni di prodotto ancora aperte.
- `docs/DECISIONS.md`: scelte durevoli adottate, con origine e motivazione.
- `docs/STATUS.md`: situazione corrente, attività in corso, impedimenti effettivi ed esito delle ultime verifiche pertinenti.

Evitare di duplicare requisiti e decisioni in più file. Le istruzioni più recenti dell'utente prevalgono sulla documentazione di progetto: aggiornare i documenti che risultano superati.

## Come lavorare

- Comunicare e scrivere la documentazione in italiano. Interfaccia, codice e commenti nel codice sono in inglese, come richiesto dall'utente.
- Leggere i file esistenti prima di modificarli e rispettare il lavoro già presente.
- Non eliminare o annullare modifiche altrui. Non creare commit, eseguire push o pubblicare il progetto senza una richiesta che lo autorizzi.
- Limitare le modifiche alla richiesta corrente; evitare funzionalità, astrazioni e configurazioni preventive.
- Distinguere requisiti confermati, ipotesi e questioni aperte. Non presentare ipotesi come decisioni prese.
- Quando una scelta è necessaria, adottare la soluzione più semplice compatibile con i requisiti confermati.
- Chiedere chiarimenti solo se manca un'informazione indispensabile per il lavoro richiesto; le questioni aperte non pertinenti possono restare tali.
- Non inserire credenziali, token, dati personali o segreti nel repository.
- Salvare i file di testo in UTF-8 e rispettare `.editorconfig`.
- I comandi verificati di installazione, avvio, build e test sono nel `README.md`. Mantenerli aggiornati quando cambiano.
- Eseguire verifiche proporzionate alla modifica e riportarne l'esito. Per modifiche solo documentali, controllare contenuti, collegamenti e codifica; quando sarà presente codice, usare anche le verifiche pertinenti disponibili. Dichiarare eventuali verifiche non eseguibili e il motivo.
- Aggiornare `docs/DECISIONS.md` quando viene presa una decisione durevole e `docs/STATUS.md` quando cambia lo stato effettivo del progetto.

## Passaggio di consegne

Al termine di un intervento, indicare cosa è cambiato, quali verifiche sono state eseguite ed eventuali punti ancora aperti. Mantenere lo stato sintetico e attuale, senza trasformarlo in un diario della conversazione.
