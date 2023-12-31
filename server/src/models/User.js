/* eslint-disable import/no-extraneous-dependencies */
const Bcrypt = require("bcrypt");
const unique = require("objection-unique");
const Model = require("./Model");
const Project = require("./Project");

const saltRounds = 10;

const uniqueFunc = unique({
    fields: ["email"],
    identifiers: ["id"],
});

class User extends uniqueFunc(Model) {
    static get tableName() {
        return "users";
    }

    set password(newPassword) {
        this.cryptedPassword = Bcrypt.hashSync(newPassword, saltRounds);
    }

    authenticate(password) {
        return Bcrypt.compareSync(password, this.cryptedPassword);
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["email"],
            properties: {
                email: { type: "string", pattern: "^\\S+@\\S+\\.\\S+$" },
                cryptedPassword: { type: "string" },
                username: { type: "string" },
            },
        };
    }

    static get relationMappings() {
        const { Project } = require("./index.js")
        return {
            projects: {
                relation: Model.HasManyRelation,
                modelClass: Project,
                join: {
                    from: "users.id",
                    to: "projects.creatorId"
                }
            }
        }
    }

    $formatJson(json) {
        const serializedJson = super.$formatJson(json);

        if (serializedJson.cryptedPassword) {
            delete serializedJson.cryptedPassword;
        }

        return serializedJson;
    }
}

module.exports = User;
