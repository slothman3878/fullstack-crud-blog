import 'dotenv/config';
import Application from './app';

(async () => {
  const application = new Application();
  await application.connect();
  await application.setUp();
  await application.init();
})();