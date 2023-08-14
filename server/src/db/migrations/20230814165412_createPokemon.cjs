/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.createTable("pokemon", (table) => {
        table.bigIncrements("id");
        table
            .bigInteger("projectId")
            .notNullable()
            .index()
            .unsigned()
            .references("projects.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table.string("name").notNullable();
        table.bigInteger("regionalNum").notNullable();
        table.bigInteger("nationalNum").notNullable();
        table.text("dexEntry");
        table.integer("baseHp").notNullable().unsigned();
        table.integer("baseAtk").notNullable().unsigned();
        table.integer("baseDef").notNullable().unsigned();
        table.integer("baseSpA").notNullable().unsigned();
        table.integer("baseSpD").notNullable().unsigned();
        table.integer("baseSpe").notNullable().unsigned();
        table.integer("introGen");
        table.integer("catchRate").notNullable();
        table.string("spriteUrl").notNullable();
        table.timestamp("createdAt").notNullable().defaultsTo(knex.fn.now());
        table.timestamp("updatedAt").notNullable().defaultsTo(knex.fn.now());
    });
};

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.dropTableIfExists("pokemon");
};
