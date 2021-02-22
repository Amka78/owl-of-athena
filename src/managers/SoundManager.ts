/* eslint-disable @typescript-eslint/no-var-requires */
//#region Import Modules
import { Audio } from "expo-av";
import { AuroraSound } from "../types";
//#endregion

//#region Class
export class SoundManager {
    private aNewDaySound = new Audio.Sound();
    private bungleCallSound = new Audio.Sound();
    private classicSound = new Audio.Sound();
    private creationSound = new Audio.Sound();
    private epicSound = new Audio.Sound();
    private greenGardenSound = new Audio.Sound();
    private singingBirdsSound = new Audio.Sound();

    private SoundList = new Array<AuroraSound>();

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

    public async loadResource(): Promise<void> {
        this.aNewDaySound.loadAsync(
            require("../../assets/audio/a_new_day.m4a")
        );
        this.bungleCallSound.loadAsync(
            require("../../assets/audio/bugle_call.m4a")
        );
        this.classicSound.loadAsync(require("../../assets/audio/classic.m4a"));
        this.creationSound.loadAsync(
            require("../../assets/audio/creation.m4a")
        );
        this.epicSound.loadAsync(require("../../assets/audio/epic.m4a"));
        this.greenGardenSound.loadAsync(
            require("../../assets/audio/green_garden.m4a")
        );
        this.singingBirdsSound.loadAsync(
            require("../../assets/audio/singing_birds.m4a")
        );
    }

    public getData(): Array<AuroraSound> {
        return this.SoundList;
    }
}
//#endregion

//#region Export
export default new SoundManager();
//#endregion
