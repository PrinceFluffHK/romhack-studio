/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.createTable("abilities", table => {
        table.bigIncrements("id")
        table.string("name")
        table.bitInteger("projectId").notNullable().index().unsigned().references("projects.id")
        table.timestamp("createdAt").notNullable().defaultsTo(knex.fn.now())
        table.timestamp("updatedAt").notNullable().defaultsTo(knex.fn.now())
    })
}

/**
 * @param {Knex} knex
*/
exports.down = (knex) => {
    return knex.schema.dropTableIfExists("abilities")
}