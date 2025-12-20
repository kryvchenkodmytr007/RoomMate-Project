import { app } from './app.js';

const port = Number(process.env.MATCHES_PORT ?? 3002);
app.listen(port, () => {
  console.log(`matches-service listening on :${port}`);
});
