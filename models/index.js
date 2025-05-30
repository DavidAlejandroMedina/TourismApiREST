const UserMongo = require('./MongoUsers');
const CelebrityMongo = require('./MongoCelebrities');
const TagCelebrityMongo = require('./MongoTagCelebrities');
const CityMongo = require('./MongoCities');
const CharacterMongo = require('./MongoCharacters');
const PlaceMongo = require('./MongoPlaces');
const VisitPlaceMongo = require('./MongoVisitPlaces');
const DishMongo = require('./MongoDishes');
const MenuPlaceMongo = require('./MongoMenuPlaces');
const CountryMongo = require('./MongoCountries');
const Server = require('./server');

module.exports = {
    Server,
    UserMongo,
    CelebrityMongo,
    TagCelebrityMongo,
    CityMongo,
    CharacterMongo,
    PlaceMongo,
    VisitPlaceMongo,
    DishMongo,
    MenuPlaceMongo,
    CountryMongo,
}

