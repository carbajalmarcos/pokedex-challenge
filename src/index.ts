import express, { Application } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 3000;
import { errorHandler } from './middlewares';
import pokemon from './routes/pokemon';

const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple Pokedex Api',
      version: '1.0.0',
    },
    servers: [{ url: `http://localhost:${port}` }],
  },
  apis: [`${path.join(__dirname, './routes/*.*')}`,],
};
// Boot express
const app: Application = express();

app.use(pokemon);
app.use(errorHandler);

// Swagger

app.use(
  '/api-doc',
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDoc(swaggerSpec))
);

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
