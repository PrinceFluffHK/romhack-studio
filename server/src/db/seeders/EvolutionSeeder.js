import got from "got";
import _ from "lodash";
import { EvoTrigger, Evolution, Pokemon } from "../../models/index.js";

class EvolutionSeeder {
    static async seed(cap) {
        const rawAllChains = await got(
            `https://pokeapi.co/api/v2/evolution-chain/?offset=0&limit=${cap}`
        );
        const parsedAllChains = JSON.parse(rawAllChains.body);
        const parsedChainList = parsedAllChains.results;
        const deepChainList = await Promise.all(
            parsedChainList.map(async (chain, index) => {
                try {
                    const rawChainData = await got(chain.url);
                    if (rawChainData) {
                        const parsedChainData = JSON.parse(rawChainData.body);

                        const linkOneMon = await Pokemon.query().findOne({
                            name: parsedChainData.chain.species.name,
                            projectId: null,
                        });
                        const linksArray = await this.parseEvolutions(
                            linkOneMon,
                            parsedChainData.chain.evolves_to
                        );
                        if (linksArray) {
                            return linksArray;
                        }
                    }
                } catch (error) {
                    console.error(chain.url);
                }
            })
        );

        const flatChainList = deepChainList.flat(2);
        const filteredArray = flatChainList.filter((link) => {
            return link !== undefined;
        });
        await Evolution.query().insertGraph(filteredArray);
    }

    static async parseEvolutions(currentLinkMon, evolves_to_array) {
        if (evolves_to_array.length > 0) {
            const nextLinkArray = await Promise.all(
                evolves_to_array.map(async (nextLink) => {
                    let nextLinkMon = await Pokemon.query().findOne({
                        name: nextLink.species.name,
                        projectId: null,
                    });

                    if (!nextLinkMon) {
                        const formName = this.getAltFormName(nextLink.species.name);
                        nextLinkMon = await Pokemon.query().findOne({
                            name: formName,
                            projectId: null,
                        });
                    }
                    const currentLink = await Evolution.query().findOne({
                        postEvoId: nextLinkMon.id,
                        projectId: null,
                    });
                    if (!currentLink) {
                        const details = await this.getDetails(nextLink.evolution_details[0]);
                        if (details) {
                            const newLink = {
                                preEvoId: currentLinkMon.id,
                                postEvoId: nextLinkMon.id,
                                triggerId: details.triggerId,
                                levelReq: details.levelReq,
                                parameter: details.parameter,
                            };
                            const nextLinks = await this.parseEvolutions(
                                nextLinkMon,
                                nextLink.evolves_to
                            );
                            if (nextLinks) {
                                return [newLink, ...nextLinks];
                            } else {
                                return newLink;
                            }
                        }
                    }
                })
            );
            return nextLinkArray;
        }
    }

    static async getDetails(evo_details) {
        const trigger = await EvoTrigger.query().findOne({
            name: evo_details.trigger.name,
            projectId: null,
        });
        const parameter = this.getParameter(evo_details);
        const minLevel = evo_details.min_level ? evo_details.min_level : 0;

        return {
            triggerId: trigger.id,
            levelReq: minLevel,
            parameter,
        };
    }

    static getParameter(evo_details) {
        const {
            gender,
            held_item,
            item,
            known_move,
            known_move_type,
            location,
            min_affection,
            min_beauty,
            min_happiness,
            needs_overworld_rain,
            party_species,
            party_type,
            relative_physical_stats,
            time_of_day,
            trade_species,
            turn_upside_down,
        } = evo_details;
        let parameter = "";
        if (gender === 1) {
            parameter = parameter.concat("Female only");
        } else if (gender === 2) {
            parameter = parameter.concat("\nMale only");
        }
        if (held_item) {
            const capitalItem = _.capitalize(held_item.name);
            parameter = parameter.concat(`\nHold ${capitalItem}`);
        }
        if (item) {
            const capitalItem = _.capitalize(item.name);
            parameter = parameter.concat(`\n${capitalItem}`);
        }
        if (known_move) {
            const capitalMove = _.capitalize(known_move.name);
            parameter = parameter.concat(`\nKnow ${capitalMove}`);
        }
        if (known_move_type) {
            const capitalType = _.capitalize(known_move_type.name);
            parameter = parameter.concat(`\n${capitalType} move`);
        }
        if (location) {
            const capitalLocation = _.capitalize(location.name);
            parameter = parameter.concat(`\nAt ${capitalLocation}`);
        }
        if (min_affection) {
            parameter = parameter.concat(`\nAffection > ${min_affection}`);
        }
        if (min_beauty) {
            parameter = parameter.concat(`\nBeauty > ${min_beauty}`);
        }
        if (min_happiness) {
            parameter = parameter.concat(`\nHappiness > ${min_happiness}`);
        }
        if (needs_overworld_rain) {
            parameter = parameter.concat(`\nNeeds Overworld Rain`);
        }
        if (party_species) {
            const capitalSpecies = _.capitalize(party_species.name);
            parameter = parameter.concat(`\n${capitalSpecies} in party`);
        }
        if (party_type) {
            const capitalType = _.capitalize(party_type.name);
            parameter = parameter.concat(`\n${capitalType}-type in party`);
        }
        if (relative_physical_stats === 1) {
            parameter = parameter.concat(`\nAtk > Def`);
        } else if (relative_physical_stats === -1) {
            parameter = parameter.concat(`\nDef > Atk`);
        } else if (relative_physical_stats === 0) {
            parameter = parameter.concat(`\nDef = Atk`);
        }
        if (time_of_day) {
            const capitalType = _.capitalize(time_of_day);
            parameter = parameter.concat(`\nTime: ${capitalType}`);
        }
        if (trade_species) {
            const capitalSpecies = _.capitalize(trade_species.name);
            parameter = parameter.concat(`\nTrade with ${capitalSpecies}`);
        }
        if (turn_upside_down) {
            parameter = parameter.concat(`\nTurn console upside-down`);
        }

        return parameter;
    }

    static getAltFormName(speciesName) {
        switch (speciesName) {
            case "wormadam":
                return "wormadam-plant";
            case "darmanitan":
                return "darmanitan-standard";
            case "basculegion":
                return "basculegion-male";
            case "meowstic":
                return "meowstic-male";
            case "meowstic":
                return "meowstic-male";
            case "aegislash":
                return "aegislash-shield";
            case "gourgeist":
                return "gourgeist-average";
            case "lycanroc":
                return "lycanroc-midday";
            case "toxtricity":
                return "toxtricity-amped";
            case "urshifu":
                return "urshifu-single-strike";
        }
    }
}

export default EvolutionSeeder;
