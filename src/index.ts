import app from './app';

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const start = (port: number) => {
  try {
    app.listen(port, () => {
      console.log(`API running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start(port);
