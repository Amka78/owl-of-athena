import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";

// moment 互換のためプラグインを一括登録する。各ファイルはこのモジュールを
// import することで、utc / フォーマット指定パース / isBetween が常に使える。
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

export default dayjs;
export type { Dayjs } from "dayjs";
