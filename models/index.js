const UsuarioMongo = require('./MongoUsuarios');
const HeroeMongo = require('./MongoHeroes');
const PeliculaMongo = require('./MongoPeliculas');
const ImagenMongo = require('./MongoImagenes');
const ImgHeroeMongo = require('./MongoImgHeroes');
const ImgPeliculaMongo = require('./MongoImgPeliculas');
const CastingMongo = require('./MongoCasting');
const Server = require('./server');

module.exports = {
    Server,
    UsuarioMongo,
    HeroeMongo,
    PeliculaMongo,
    ImagenMongo,
    ImgHeroeMongo,
    ImgPeliculaMongo,
    CastingMongo,
}

