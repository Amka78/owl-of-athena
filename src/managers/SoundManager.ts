/* eslint-disable @typescript-eslint/no-var-requires */
//#region Import Modules
import { createAudioPlayer } from "expo-audio";
import type { AuroraSound } from "../types";
//#endregion

//#region Class
export class SoundManager {
    // expo-audio の player は生成時に読み込みを開始するため、事前の loadAsync は不要
    private aNewDaySound = createAudioPlayer(require("../../assets/audio/a_new_day.m4a"));
    private bungleCallSound = createAudioPlayer(require("../../assets/audio/bugle_call.m4a"));
    private classicSound = createAudioPlayer(require("../../assets/audio/classic.m4a"));
    private creationSound = createAudioPlayer(require("../../assets/audio/creation.m4a"));
    private epicSound = createAudioPlayer(require("../../assets/audio/epic.m4a"));
    private greenGardenSound = createAudioPlayer(require("../../assets/audio/green_garden.m4a"));
    private singingBirdsSound = createAudioPlayer(require("../../assets/audio/singing_birds.m4a"));

    private SoundList = [] as AuroraSound[];

    public constructor() {
        this.SoundList.push({
            fileName: "a_new_day.m4a",
            sound: this.aNewDaySound,
        });
        this.SoundList.push({
            fileName: "bugle_call.m4a",
            sound: this.bungleCallSound,
        });
        this.SoundList.push({
            fileName: "classic.m4a",
            sound: this.classicSound,
        });
        this.SoundList.push({
            fileName: "creation.m4a",
            sound: this.creationSound,
        });
        this.SoundList.push({
            fileName: "epic.m4a",
            sound: this.epicSound,
        });
        this.SoundList.push({
            fileName: "green_garden.m4a",
            sound: this.greenGardenSound,
        });
        this.SoundList.push({
            fileName: "singing_birds.m4a",
            sound: this.singingBirdsSound,
        });
    }

    public getData(): Array<AuroraSound> {
        return this.SoundList;
    }
}
//#endregion

//#region Export
export default new SoundManager();
//#endregion
