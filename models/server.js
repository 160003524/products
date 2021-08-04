const express = require('express');
const cors = require('cors');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.paths = {
      product: '/api/product',
    };
    //Middlewares
    this.middlewares();
    //Rutas de la app
    this.routes();
  }

  middlewares() {
    //CORS
    this.app.use(cors());
    //parseo y lectura del body
    this.app.use(express.json());
    //directorio publico
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.paths.product, require('../routes/product.routes'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`corriendo en: ${this.port}`);
    });
  }
}

module.exports = Server;
