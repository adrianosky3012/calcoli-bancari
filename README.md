# Calcoli Bancari

App (PWA) con le formule del foglio `Calcoli_Bancari_plus.xlsx`. Funziona anche offline.

- **9 tab**, uno per tabella del foglio
- **Celle gialle** = dati da inserire; righe verdi = totali; il resto si calcola da solo
- **Ogni modifica viene salvata subito** sul telefono
- **Salva backup**: su Android si apre il menu di condivisione (scegli Drive, File, ecc.); in alternativa scarica il file nella cartella Download
- **Ripristina**: ricarica un file di backup

## Pubblicazione su GitHub Pages
1. Su GitHub crea un repository (es. `calcoli-bancari`), pubblico, con **Add a README file** su **On**.
2. Carica **tutti** i file e la cartella `icons` nella radice del repository (Add file → Upload files). Il `README.md` esistente verrà sostituito: va bene.
3. Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
4. Dopo 1-2 minuti l'app è su `https://TUO-UTENTE.github.io/calcoli-bancari/`.

## Installazione su Android
Apri il link con Chrome → menu ⋮ → **Installa app** (o *Aggiungi a schermata Home*).

## Aggiornamenti
Dopo aver modificato dei file, cambia il numero di versione in `sw.js` (`const CACHE = 'calcoli-bancari-v2'`), così il telefono scarica la nuova versione.
