# Group Plans

Prima versione locale di una webapp per organizzare vacanze ed eventi tra amici. Il nome del prodotto resta provvisorio. Interfaccia e codice sono in inglese; la documentazione di progetto è in italiano.

## Cosa contiene

- **Calendar**: calendario mensile e agenda, filtri per gruppo, selezione del giorno ed eventi anche su più giorni. Su schermi piccoli, gli eventi sono indicati da punti colorati; selezionando il giorno si leggono i dettagli nella scheda sottostante.
- **Groups**: elenco dei gruppi, dettaglio con partecipanti, eventi futuri e passati, creazione di gruppi ed eventi.
- **Profile**: nome, città e descrizione modificabili; statistiche personali, eventi a cui si partecipa e gruppi.
- Creazione, modifica ed eliminazione di eventi; stato “In planning” o “Confirmed”; partecipazione modificabile con “Count me in”.

I dati iniziali sono esempi fittizi. Il salvataggio avviene esclusivamente nel `localStorage` del browser, senza database, autenticazione o sincronizzazione tra persone e dispositivi. La prima creazione di un gruppo aggiunge soltanto l'utente locale: non esiste un invio di inviti.

## Avvio locale

Ambiente verificato: Windows, Node.js 24.12.0 e npm 11.6.2. Serve Node.js 24 o successivo anche per i test TypeScript nativi.

Le dipendenze sono già installate nella cartella di lavoro. Per avviare l'app, dalla cartella del progetto:

```powershell
npm.cmd run dev
```

Aprire `http://127.0.0.1:5173/`. Il server ascolta soltanto sull'interfaccia locale. Per arrestarlo: `Ctrl+C`. In PowerShell si usa `npm.cmd` per evitare il blocco dei file `.ps1` previsto dall'attuale policy del sistema.

La configurazione `.npmrc` forza la modalità offline. Per reinstallare le dipendenze dal file di lock:

```powershell
npm.cmd ci --offline --ignore-scripts --no-audit --no-fund --logs-dir .npm-logs
```

Il comando richiede che gli archivi siano già nella cache npm locale. Su un computer privo di questa cache, l'installazione si fermerà: l'accesso a Internet non è autorizzato. Non sono necessarie credenziali o file `.env`.

## Verifiche

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run test:render
npm.cmd run build
```

I test coprono le operazioni sui dati, le date, gli eventi su più giorni, le statistiche e il salvataggio locale. `test:render` verifica il rendering delle pagine e dei moduli senza usare un browser; non sostituisce una verifica visiva o delle interazioni nel browser.

La build produce `dist/`. Per controllare localmente la build:

```powershell
npm.cmd run preview
```

L'indirizzo è `http://127.0.0.1:4173/`. Nessuno di questi comandi pubblica il progetto.

## Mappa del progetto

| Percorso | Scopo |
| --- | --- |
| [src/App.tsx](src/App.tsx) | Stato condiviso, navigazione locale e collegamento dei flussi. |
| `src/pages/` | Calendar, Groups, dettaglio gruppo e Profile. |
| `src/components/` | Componenti comuni, moduli e dettaglio evento. |
| [src/lib/actions.ts](src/lib/actions.ts) | Operazioni immutabili e controlli sui dati. |
| [src/lib/dates.ts](src/lib/dates.ts) | Date locali, calendario e statistiche. |
| [src/lib/storage.ts](src/lib/storage.ts) | Salvataggio locale, validazione e punto commentato per un'eventuale integrazione futura. |
| [src/data/seed.ts](src/data/seed.ts) | Esempi fittizi generati al primo avvio. |
| [src/styles.css](src/styles.css) | Stile responsive, senza font o risorse esterne. |
| `tests/` | Test della logica e controlli di rendering. |
| [AGENTS.md](AGENTS.md) | Istruzioni operative per gli agenti. |
| [docs/PRODUCT.md](docs/PRODUCT.md) | Requisiti confermati e questioni di prodotto aperte. |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Scelte durevoli e motivazioni. |
| [docs/STATUS.md](docs/STATUS.md) | Stato attuale ed esito delle verifiche. |

## Dati locali

Il profilo contiene il pulsante **Reset sample data**, con conferma, per ricominciare dagli esempi. Questa operazione sostituisce le modifiche salvate in quel browser.

Se il salvataggio non è disponibile o i dati precedenti risultano illeggibili, l'app mostra un avviso. I dati illeggibili non vengono sovrascritti automaticamente. La cancellazione dei dati del browser elimina i piani locali; browser o indirizzi diversi mantengono archivi separati.
