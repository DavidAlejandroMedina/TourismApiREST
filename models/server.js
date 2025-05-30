const express = require('express')
const cors = require('cors')

const { bdmongo } = require('../database/MongoConnection')


class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //Conecta con BD inmediatamente que llamen a la clase
        this.dbConnection();
        this.app.use(express.json());

        //Enrutamiento
        this.pathMongo = {
            auth: '/api_v1/auth',
            users: '/api_v1/users',
            celebrities: '/api_v1/celebrities',
            tagCelebrities: '/api_v1/tagCelebrities',
            cities: '/api_v1/cities',
            characters: '/api_v1/characters',
            places: '/api_v1/places',
            visitPlaces: '/api_v1/visitPlaces',
            dishes: '/api_v1/dishes',
            menuPlaces: '/api_v1/menuPlaces',
            countries: '/api_v1/countries',
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
        // Rutas para MongoDB
        this.app.use(this.pathMongo.auth, require('../routes/MongoAuth'));
        this.app.use(this.pathMongo.users, require('../routes/MongoUsers'));
        this.app.use(this.pathMongo.celebrities, require('../routes/MongoCelebrities'));    
        this.app.use(this.pathMongo.tagCelebrities, require('../routes/MongoTagCelebrities'));
        this.app.use(this.pathMongo.cities, require('../routes/MongoCities'));
        // this.app.use(this.pathMongo.characters, require('../routes/MongoCharacters'));
        this.app.use(this.pathMongo.places, require('../routes/MongoPlaces'));
        this.app.use(this.pathMongo.visitPlaces, require('../routes/MongoVisitPlaces'));
        this.app.use(this.pathMongo.dishes, require('../routes/MongoDishes'));
        this.app.use(this.pathMongo.menuPlaces, require('../routes/MongoMenuPlaces'));
        this.app.use(this.pathMongo.countries, require('../routes/MongoCountries'));
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