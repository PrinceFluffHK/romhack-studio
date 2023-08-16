const Model = require("./Model");

class ProjectPokemon extends Model {
    static get tableName() {
        return "project-pokemon";
    }

    static get relationMappings() {
        const { Project, ProjectType } = require("./index");
        return {
            project: {
                relation: Model.BelongsToOneRelation,
                modelClass: Project,
                join: {
                    from: "project-pokemon.projectId",
                    to: "project.id"
                }
            },
            types: {
                relation: Model.ManyToManyRelation,
                modelClass: ProjectType,
                join: {
                    from: "project-pokemon.projectId",
                    through: {
                        from: "project-type-slots.pokemonId",
                        to: "project-type-slots.typeId"
                    },
                    to: "project-types.id"
                }
            }
        }
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: [
                "name",
                "baseHp",
                "baseAtk",
                "baseDef",
                "baseSpA",
                "baseSpD", 
                "baseSpe", 
                "catchRate",
                "spriteUrl",
                "profileUrl",
                "nationalNum",
            ],
            properties: {
                name: { type: "string" },
                baseHp: { type: ["string", "integer"] },
                baseAtk: { type: ["string", "integer"] },
                baseDef: { type: ["string", "integer"] },
                baseSpA: { type: ["string", "integer"] },
                baseSpD: { type: ["string", "integer"] },
                baseSpe: { type: ["string", "integer"] },
                catchRate: { type: ["string", "integer"] },
                spriteUrl: { type: "string" },
                profileUrl: { type: "string" },
                generation: { type: ["string", "integer"] },
                nationalNum: { type: ["string", "integer"] },
            }
        };
    }
}

module.exports = ProjectPokemon;
