const express = require('express')
const cors = require('cors')

const { bdmysql } = require('../database/MySqlConnection')
const { bdmongo } = require('../database/MongoConnection')


class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT; //Se asigna la variable de entorno

        //Conecta con BD inmediatamente que llamen a la clase
        this.dbConnection();
        this.app.use(express.json());

        //Enrutamiento
        this.pathMySql = {
            auth:   '/api/auth',
            heroes: '/api/heroes',
            peliculas: '/api/peliculas',
            casting_peliculas: '/api/casting',
            usuarios: '/api/usuarios',
            imagenes: '/api/imagenes',
            img_heroes: '/api/imgHeroes',
            img_peliculas: '/api/imgPeliculas'
        }

        this.pathMongo = {
            auth: '/api_v2/auth',
            heroes: '/api_v2/heroes',
            peliculas: '/api_v2/peliculas',
            casting: '/api_v2/casting',
            usuarios: '/api_v2/usuarios',
            imagenes: '/api_v2/imagenes',
            img_heroes: '/api_v2/imgHeroes',
            img_peliculas: '/api_v2/imgPeliculas'
        }
        
        //Middlewares
        this.middlewares();
        
        // Rutas de la aplicación
        // this.app.get("/", (req, res) => {
        //     res.send("Hello World!");
        // })
        this.routes();
    }

    // async conectarDBMySql(){
    //     await bdmysql();
    // }

    
    // Metodo que realiza la conexión a la BD, es asincrono porque lo hace hasta que logre.
    async dbConnection(){

        // Conexión a MySQL
        /*try {
            await bdmysql.authenticate();
            console.log('Connection OK a MySQL.');
        } catch (error) {
            console.error('No se pudo Conectar a la BD MySQL: ', error);
        }*/

        // Conexión a MongoDB
        await bdmongo();
    }

    // Establezco las rutas de acceso RESTFUL. Hay 2 maneras
    /* 1. Por método */
    routes(){
        // Rutas para MySQL
        this.app.use(this.pathMySql.auth, require('../routes/MySqlAuth'));
        this.app.use(this.pathMySql.heroes, require('../routes/MySqlHeroes'));
        this.app.use(this.pathMySql.peliculas, require('../routes/MySqlPeliculas'));
        this.app.use(this.pathMySql.casting_peliculas, require('../routes/MySqlCasting'));
        this.app.use(this.pathMySql.usuarios, require('../routes/MySqlUsuarios'));
        this.app.use(this.pathMySql.imagenes, require('../routes/MySqlImagenes'));
        this.app.use(this.pathMySql.img_heroes, require('../routes/MySqlImgHeroes'));
        this.app.use(this.pathMySql.img_peliculas, require('../routes/MySqlImgPeliculas'));

        // Rutas para MongoDB
        this.app.use(this.pathMongo.auth, require('../routes/MongoAuth'));
        this.app.use(this.pathMongo.usuarios, require('../routes/MongoUsuarios'));
        this.app.use(this.pathMongo.heroes, require('../routes/MongoHeroes'));
        this.app.use(this.pathMongo.peliculas, require('../routes/MongoPeliculas'));
        this.app.use(this.pathMongo.imagenes, require('../routes/MongoImagenes'));
        this.app.use(this.pathMongo.img_heroes, require('../routes/MongoImgHeroes'));
        this.app.use(this.pathMongo.img_peliculas, require('../routes/MongoImgPeliculas'));
        this.app.use(this.pathMongo.casting, require('../routes/MongoCasting'));
    }

    middlewares(){
        // Evita errores por Cors Domain Access
        this.app.use(cors());

        //Lectura y Parseo del body
        //JSON
        this.app.use(express.json());
        
        // Manejo del directorio público
        this.app.use(express.static('public'));
    }

    //Metodo que permite escuchar en qué puerto se establecerá el servicio
    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        })
    }
}

module.exports = Server;