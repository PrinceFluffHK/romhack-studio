/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.createTable("types", table => {
        table.bigIncrements("id")
        table.string("name").notNullable()
        table.string("iconUrl").notNullable()
        table.string("labelUrl").notNullable()
        table.integer("generation")
        table
            .bigInteger("projectId")
            .index()
            .unsigned()
        table.timestamp("createdAt").notNullable().defaultsTo(knex.fn.now());
        table.timestamp("updatedAt").notNullable().defaultsTo(knex.fn.now());
    })
}

/**
 * @param {Knex} knex
*/
exports.down = (knex) => {
    return knex.schema.dropTableIfExists("types")
}
