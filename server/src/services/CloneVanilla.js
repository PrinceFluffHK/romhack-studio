import { ProjectPokemon, ProjectType, VanillaPokemon, VanillaType } from "../models/index.js";

class CloneVanilla {
    static async pokemon(generation, projectId) {
        const fullMonList = await VanillaPokemon.query();
        fullMonList.forEach(async (mon) => {
            if (mon.generation <= generation) {
                const {
                    name,
                    baseHp,
                    baseAtk,
                    baseDef,
                    baseSpA,
                    baseSpD,
                    baseSpe,
                    evHp,
                    evAtk,
                    evDef,
                    evSpA,
                    evSpD,
                    evSpe,
                    spriteUrl,
                    profileUrl,
                    nationalNum,
                    generation,
                } = mon;
                const newMon = {
                    name,
                    baseHp,
                    baseAtk,
                    baseDef,
                    baseSpA,
                    baseSpD,
                    baseSpe,
                    evHp,
                    evAtk,
                    evDef,
                    evSpA,
                    evSpD,
                    evSpe,
                    spriteUrl,
                    profileUrl,
                    nationalNum,
                    generation,
                    projectId,
                };
                const newProjectMon = await ProjectPokemon.query().insertAndFetch(newMon);
                const vanillaTypes = await mon.$relatedQuery("types")
                console.log(newProjectMon)
                console.log(vanillaTypes)
                console.log(projectId)
                // await this.typeSlots(newProjectMon, vanillaSlots, projectId)
            }
        });
    }

    static async types(projectId) {
        const fullTypeList = await VanillaType.query();
        fullTypeList.forEach(async (type) => {
            const { name, iconUrl, labelUrl } = type;
            const newType = {
                name,
                iconUrl,
                labelUrl,
                projectId,
            };
            await ProjectType.query().insert(newType);
        });
    }

    static async typeSlots(mon, slots, projectId) {
        
    }
}

export default CloneVanilla