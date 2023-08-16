// include all of your models here using CommonJS requires
const User = require("./User.js");
const Project = require("./Project.js");
const VanillaPokemon = require("./VanillaPokemon.js");
const ProjectPokemon = require("./ProjectPokemon.js");
const VanillaType = require("./VanillaType.js");
const VanillaTypeSlot = require("./VanillaTypeSlot.js");
const ProjectType = require("./ProjectType.js");
const ProjectTypeSlot = require("./ProjectTypeSlot.js");

module.exports = {
    User,
    Project,
    VanillaPokemon,
    ProjectPokemon,
    VanillaType,
    VanillaTypeSlot,
    ProjectType,
    ProjectTypeSlot,
};
