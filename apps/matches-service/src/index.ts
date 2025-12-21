import { app } from './app.js';

const port = process.env.MATCHES_PORT ?? '3002';

app.listen(Number(port), () => {
  console.log(`matches-service listening on :${port}`);
});
