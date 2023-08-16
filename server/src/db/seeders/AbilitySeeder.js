import got from "got";
import { Ability } from "../../models/index.js";

class AbilitySeeder {
    static async seed() {
        const rawAllAbilities = await got("https://pokeapi.co/api/v2/ability?offset=0&limit=500")
        const parsedAllAbilities = JSON.parse(rawAllAbilities.body)
        const parsedAbilityList = parsedAllAbilities.results
        for (const singleAbility of parsedAbilityList) {
            const currentAbility = await Ability.query().findOne({
                name: singleAbility.name
            })
            if (!currentAbility) {
                const rawAbilityData = await got(singleAbility.url)
                const parsedAbility = JSON.parse(rawAbilityData)
                const englishEffects = parsedAbility.effect_entries.filter(entry => {
                    entry.language.name === "en"
                })
                const generation = parseInt(parsedAbility.generation.url[38])
                const ability = {
                    name: parsedAbility.name,
                    description: englishEffects[0],
                    generation: generation
                }
                await ability.query().insert(ability)
            }
        }
    }
}

export default AbilitySeeder