import { app } from './app.js';

const port = process.env.PROFILES_PORT ?? '3001';

app.listen(Number(port), () => {
  console.log(`profiles-service listening on :${port}`);
});
