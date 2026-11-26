# DILO

**Together, We Make Dreams Come True.** A private community app where families and friends plan events, share wishlists and record contributions.

Status: **Phase 1 prototype**, demo data only. No real accounts, no database, no payments.

## View it on an Android phone (Termux)
The `preview/` folder holds the ready-built site, so the phone never compiles anything.

```
cd ~/dilo && git pull
node scripts/serve.mjs preview
```
Then open http://localhost:8080 in Chrome. Stop with Ctrl+C.

## Develop (Claude's workspace)
```
npm install
npm run build            # static export to out/
npm run preview:update   # build and refresh preview/
```

## Docs
- `docs/notes/` — step reports
- `docs/brand/` — logo reference and colours
- `docs/learning/` — beginner notes (Hindi)
