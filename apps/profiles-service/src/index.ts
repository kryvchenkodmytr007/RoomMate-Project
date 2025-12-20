import { app } from './app.js';

const port = Number(process.env.PROFILES_PORT ?? 3001);
app.listen(port, () => {
  console.log(`profiles-service listening on :${port}`);
});
