import moment from "moment";
import isPlainObject from "lodash/isPlainObject";
import camelCase from "lodash/camelCase";
import { LedEffects, LedColors } from "./AuroraConstants";
import Stream from "stream";
const sleep = (ms = 0): any => new Promise(resolve => setTimeout(resolve, ms));

const promisify = (fn: Function, context: any = undefined) => {
    return (...args: any[]): Promise<unknown> => {
        return new Promise((resolve, reject) => {
            fn.apply(
                context,
                args.concat((error: unknown, result: unknown) => {
                    if (error) return reject(error);

                    resolve(result);
                })
            );
        });
    };
};

const promisifyStream = (stream: Stream): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        stream.once("close", resolve);
        stream.once("error", reject);
        stream.once("end", resolve);
    });
};

const parseValueString = (value: string): any => {
    value = value.trim();

    const valWithoutNumericSymbols: any = value.replace(/[$%,]+|(ms$)/g, "");

    if (!isNaN(valWithoutNumericSymbols)) {
        return +valWithoutNumericSymbols;
    }

    //support the funky date format GCC uses for __TIME__ constant
    const date = moment.utc(
        value,
        [
            moment.ISO_8601,
            "YYYY-MM-DD HH:mm:ss:SSS",
            "MMM D YYYY - HH:mm:ss",
            "MMM  D YYYY - HH:mm:ss",
            "MMM DD YYYY - HH:mm:ss"
        ],
        true
    );

    if (date.isValid()) {
        return +date;
    }

    //TODO: eventually remove this, as in the future, uppercase will be
    //required to trigger conversion
    const valueUC = value.toUpperCase();

    if (
        valueUC === "TRUE" ||
        valueUC === "ON" ||
        valueUC === "ACTIVE" ||
        valueUC === "YES"
    ) {
        return true;
    } else if (
        valueUC === "FALSE" ||
        valueUC === "OFF" ||
        valueUC === "INACTIVE" ||
        valueUC === "NO" ||
        valueUC === "NONE"
    ) {
        return false;
    } else if (valueUC === "UNKNOWN") {
        return 0;
    }

    return value;
};

const camelCaseObjectKeys = (object: any): any => {
    const camelCaseObject: any = {};

    for (const key of Object.keys(object)) {
        let value = object[key];

        if (isPlainObject(value)) {
            value = exports.camelCaseObjectKeys(value);
        }

        camelCaseObject[camelCase(key)] = value;
    }

    return camelCaseObject;
};

exports.maskFromIds = (...ids: any[]): any => {
    return ids.reduce((mask, id) => mask + (1 << id), 0);
};

const versionToString = (version: number): string => {
    if (!version) return "UNKNOWN";

    const major = Math.floor(version / 10000);
    const minor = Math.floor((version - major * 10000) / 100);
    const build = version - major * 10000 - minor * 100;

    return `v${major}.${minor}.${build}`;
};

const getEnumlength = (target: any): number => {
    let count = 0;
    Object.keys(target).forEach((val): void => {
        if (Number(isNaN(Number(val)))) {
            count++;
        }
    });
    return count;
};

const stringToVersion = (versionString: string): number => {
    const version = versionString.split(".");

    if (version.length != 3) return 0;

    return (
        parseInt(version[0]) * 10000 +
        parseInt(version[1]) * 100 +
        parseInt(version[2])
    );
};

const buzzSongObjToCmd = (songObj: any): any => {
    // eslint-disable-next-line prefer-const
    let { song, repeat, volume, tempoAdjust, pitchAdjust } = songObj;

    if (!song) throw new Error("Song field is required.");

    repeat = parseInt(repeat);

    if (isNaN(repeat)) {
        repeat = 0;
    }

    volume = parseInt(volume);
    volume = isNaN(volume) ? 100 : Math.min(100, Math.max(0, volume));

    tempoAdjust = parseFloat(tempoAdjust);
    tempoAdjust = isNaN(tempoAdjust)
        ? 1
        : Math.min(2.5, Math.max(0.25, tempoAdjust));

    pitchAdjust = parseInt(pitchAdjust);
    pitchAdjust = isNaN(pitchAdjust)
        ? 0
        : Math.min(12, Math.max(-12, pitchAdjust));

    return `buzz-song ${song} ${repeat} ${volume} ${tempoAdjust} ${pitchAdjust}`;
};

const ledEffectObjToCmd = (effectObj: any): any => {
    const effect = LedEffects.find(e => e.name == effectObj.effect);

    if (!effect) {
        throw new Error("Invalid effect specified.");
    }

    // @ts-ignore
    const [eyes, state1Eyes, state2Eyes] = [
        "eyes",
        "state1Eyes",
        "state2Eyes"
        // @ts-ignore
    ].map(option => {
        const eyesOption = effectObj[option];

        if (typeof eyesOption == "string") {
            switch (eyesOption.toLowerCase()) {
                case "right":
                    return "0x02";

                case "left":
                    return "0x01";

                case "none":
                    return "0x00";

                case "both":
                default:
                    return "0x03";
            }
        } else {
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const eye = parseInt(eyesOption);

            return isNaN(eyes) || eyes < 0 || eyes > 3 ? 3 : eyes;
        }

        return 3;
    });

    const [brightness, state1Brightness, state2Brightness] = [
        "brightness",
        "state1Brightness",
        "state2Brightness"
    ].map(option => {
        const brightnessOption = effectObj[option];
        const brightness = parseInt(brightnessOption);

        if (isNaN(brightness) || brightness > 255 || brightness < 0) {
            return "0xFF";
        }

        return (
            "0x" +
            ("00" + Math.round(brightness * (255 / 100)).toString(16))
                .slice(-2)
                .toUpperCase()
        );
    });

    const [color, state1Color, state2Color] = [
        "color",
        "state1Color",
        "state2Color"
    ].map(option => {
        const colorOption = effectObj[option];

        if (!colorOption || colorOption == "off" || colorOption == "black") {
            return "0x000000";
        }

        let color = LedColors.find(c => c.name == colorOption);
        color = !color ? colorOption : color.value;
        // @ts-ignore
        color = color.replace("#", "0x");

        // @ts-ignore
        return isNaN(parseInt(color)) ? "0x000000" : color.toUpperCase();
    });

    const [state1Duration, state2Duration, transitionDuration] = [
        "state1Duration",
        "state2Duration",
        "transitionDuration"
    ].map(option => {
        const durationOption = effectObj[option];
        const duration = parseFloat(durationOption);

        if (isNaN(duration)) {
            return 1000;
        }

        return Math.round(duration * 1000);
    });

    let shutoffDelay = parseInt(effectObj.shutoffDelay);
    shutoffDelay = isNaN(shutoffDelay) ? 0 : Math.round(shutoffDelay * 1000);

    switch (effect.name) {
        case "set":
            return `${effect.cmd} ${eyes} ${color} ${brightness} ${shutoffDelay}`;

        case "blink":
            // eslint-disable-next-line no-case-declarations
            let blinkCount = parseInt(effectObj.blinkCount);
            blinkCount = isNaN(blinkCount) ? 1 : blinkCount;
            // eslint-disable-next-line no-case-declarations
            let blinkRate = parseFloat(effectObj.blinkRate);
            blinkRate = isNaN(blinkRate) ? 500 : Math.round(blinkRate * 1000);
            return `${effect.cmd} ${eyes} ${color} ${brightness} ${blinkCount} ${blinkRate} ${shutoffDelay}`;

        case "alternate":
            // eslint-disable-next-line no-case-declarations
            let alternateCount = parseInt(effectObj.alternateCount);
            alternateCount = isNaN(alternateCount) ? 1 : alternateCount;
            return `${effect.cmd} ${state1Eyes} ${state1Color} ${state1Brightness} ${state1Duration} ${state2Eyes} ${state2Color} ${state2Brightness} ${state2Duration} ${alternateCount} ${shutoffDelay}`;

        case "transition":
            // eslint-disable-next-line no-case-declarations
            const transitionRewind = effectObj.transitionRewind ? 1 : 0;
            return `${effect.cmd} ${state1Eyes} ${state1Color} ${state1Brightness} ${state2Eyes} ${state2Color} ${state2Brightness} ${transitionDuration} ${transitionRewind} ${shutoffDelay}`;
    }
};
export {
    buzzSongObjToCmd,
    camelCaseObjectKeys,
    getEnumlength,
    parseValueString,
    stringToVersion,
    sleep,
    promisify,
    promisifyStream,
    ledEffectObjToCmd,
    versionToString
};
