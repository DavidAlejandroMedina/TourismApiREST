const e = require("express");
const { 
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
} = require("../models");


// const esRoleValido = async (rol = "") => {
//   const existeRol = await Role.findById( rol );
//   if (!existeRol) {
//     throw new Error(`El rol ${rol} no existe en la Base de Datos...`);
//   }
// };


//Mongo
const existEmail = async (email = "") => {
  const existEmail = await UserMongo.findOne({ email });
  if (existEmail) {
    throw new Error(`El email ${email} ya existe en la Base de Datos...`);
  }
};


//Mongo
const existUserById = async (id) => {
  const existUser = await UserMongo.findById(id);
  if (!existUser) {
    throw new Error(`El id no existe ${id}`);
  }
};

const existCountryById = async (id) => {
  const existCountry = await CountryMongo.findById(id);
  if (!existCountry) {
    throw new Error(`El id no existe ${id}`);
  }
};

const existCelebrityById = async (id) => {
  const existCelebrity = await CelebrityMongo.findById(id);
  if (!existCelebrity) {
    throw new Error(`El id no existe ${id}`);
  }
};

const existTagCelebrityById = async (id) => {
  const existTagCelebrity = await TagCelebrityMongo.findById(id);
  if (!existTagCelebrity) {
    throw new Error(`El id no existe ${id}`);
  }
};

const existCityById = async (id) => {
  const existCity = await CityMongo.findById(id);
  if (!existCity) {
    throw new Error(`El id no existe ${id}`);
  }
};

const existPlaceById = async (id) => {
  const existPlace = await PlaceMongo.findById(id);
  if (!existPlace) {
    throw new Error(`El id no existe ${id}`);
  }
};

const existVisitPlaceById = async (id) => {
  const existVisitPlace = await VisitPlaceMongo.findById(id);
  if (!existVisitPlace) {
    throw new Error(`El id no existe ${id}`);
  }
};

const existDishById = async (id) => {
  const existDish = await DishMongo.findById(id);
  if (!existDish) {
    throw new Error(`El id no existe ${id}`);
  }
};

const existMenuPlaceById = async (id) => {
  const existMenuPlace = await MenuPlaceMongo.findById(id);
  if (!existMenuPlace) {
    throw new Error(`El id no existe ${id}`);
  }
};

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

  const incluida = colecciones.includes( coleccion );
  if ( !incluida ) {
      throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
  }
  return true;
}


module.exports = {
    existEmail,
    existUserById,
    existCountryById,
    existCelebrityById,
    existTagCelebrityById,
    existCityById,
    existPlaceById,
    existVisitPlaceById,
    existDishById,
    existMenuPlaceById,

    coleccionesPermitidas,
    //esRoleValido,
};
