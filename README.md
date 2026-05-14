# Carta Viva

Site simples para um jogo de cartas com perguntas customizaveis e suporte multiplayer em tempo real.

## Como rodar

```bash
npm start
```

Depois, abra `http://localhost:3000`.

## Como publicar

O projeto esta pronto para subir como um servico Node no Render.

1. Envie esta pasta para um repositorio no GitHub.
2. No Render, escolha a opcao de criar um Blueprint a partir do repositorio.
3. O arquivo `render.yaml` vai criar o servico `carta-viva` com `npm install`, `npm start` e um disco persistente para os decks salvos.
4. Depois do deploy, o site recebe uma URL publica `onrender.com`.

### Observacoes de deploy

- O multiplayer depende do `server.js`, entao `Firebase Hosting` puro nao atende este projeto sozinho.
- Os decks salvos vao para `saved-decks.json`. Em producao, o app usa `DATA_DIR` para guardar esse arquivo dentro do disco persistente.
- O disco persistente exige plano pago no Render. Se remover o disco, a aplicacao sobe, mas os decks salvos podem sumir a cada reinicio.

## Como publicar no Firebase

Para este projeto, use Firebase Hosting com Cloud Run.

1. Crie ou escolha o projeto `cartas-61ac6` no Firebase e no Google Cloud.
2. Crie um servico Cloud Run chamado `carta-viva`.
3. Publique o backend:

```bash
gcloud run deploy carta-viva --source . --region us-central1 --allow-unauthenticated
```

4. Publique o front e o rewrite do Hosting:

```bash
npx firebase-tools deploy --only hosting
```

### Observacoes do Firebase

- O arquivo `firebase.json` ja esta configurado para servir `public/` no Hosting e encaminhar `/api/**` para o Cloud Run `carta-viva` em `us-central1`.
- O snippet `firebaseConfig` do SDK web nao faz deploy; ele so conecta o front a servicos do Firebase no navegador.
- No Cloud Run, o sistema de arquivos e efemero. Entao `saved-decks.json` e as salas em memoria nao sao persistentes entre reinicios. Para producao real, migre isso para Firestore ou Realtime Database.

## O que este MVP entrega

- Criacao de salas por codigo
- Entrada de varios jogadores na mesma partida
- Baralho editavel no lobby
- Cartas com titulo, categoria, pergunta e cor customizada
- Rodada sincronizada para todos os jogadores
- Reinicio da rodada e retorno ao lobby para editar o baralho

## Observacao

Os dados ficam em memoria no servidor. Se o processo for reiniciado, as salas e cartas criadas sao perdidas.
"# Cartas" 
