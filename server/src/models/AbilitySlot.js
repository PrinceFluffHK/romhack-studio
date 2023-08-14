const Model = require("./Model")

class AbilitySlot extends Model {
    static get tableName() {
        return "ability-slots"
    }

    static get relationMappings() {
        const { Pokemon, Ability } = require("./index")
        return {
            ability: {
                relation: Model.BelongsToOneRelation,
                modelClass: Ability,
                join: {
                    from: "ability-slots.abilityId",
                    to: "abilities.id"
                }
            },
            pokemon: {
                relation: Model.BelongsToOneRelation,
                modelClass: Pokemon,
                join: {
                    from: "ability-slots.pokemonId",
                    to: "pokemon.id"
                }
            },
        }
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["slot"],
            properties: {
                slot: { type: ["string", "integer"] }
            }
        }
    }
}

module.exports = AbilitySlot