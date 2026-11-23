//#region Import Modules
import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import { Component } from "react";
import { Text, type TextStyle, TouchableOpacity, View, type ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";

import type { ThemeType } from "../../constants/Theme";

//#endregion

//#region Types
export type TimePickerStyle = {
    textColor?: string;
    backgroundColor?: string;
    activeColor?: string;
    borderColor?: string;
    fontSize?: number;
    borderRadius?: number;
    iconSize?: number;
};

export type InlineTimePickerProps = {
    containerStyle?: ViewStyle;
    style?: TimePickerStyle;
    initialTime?: Date | { hours: number; minutes: number; seconds: number };
    onChangeTime?: (hours?: number, minutes?: number, seconds?: number) => void;
    mode24hours?: boolean;
    mode?: TimePickerMode;
    theme?: ThemeType;
};

type InlineTimePickerState = {
    hours: number;
    minutes: number;
    seconds: number;
    meridian: "AM" | "PM";
    updating?: TimeField;
};
type TimeField = "hours" | "minutes" | "seconds";
type TimePickerMode = "full" | "minute";
//#endregion

//#region Component
export const InlineTimePicker = (props: InlineTimePickerProps): React.ReactNode => {
    const theme = useTheme();
    return <InlineTimePickerCore {...props} theme={theme}></InlineTimePickerCore>;
};
class InlineTimePickerCore extends Component<InlineTimePickerProps, InlineTimePickerState> {
    private style: TimePickerStyle;

    private interval?: ReturnType<typeof setInterval>;

    private mode?: TimePickerMode;
    constructor(props: InlineTimePickerProps) {
        super(props);

        console.debug("InlineTimePickerProps:", props);
        this.state = {
            hours: 12,
            minutes: 0,
            seconds: 0,
            meridian: "AM",
            updating: undefined,
        };
        this.interval = undefined;

        this.mode = "full";
        if (this.props.mode) {
            this.mode = this.props.mode;
        }

        this.style = {};

        if (this.props?.style) {
            this.style = this.props.style;
        }

        this.setStyle(this.props.theme);
    }

    public async componentDidMount(): Promise<void> {
        let initialDate = new Date();

        if (this.props.initialTime !== undefined) {
            if ("hours" in this.props.initialTime) {
                initialDate = new Date(
                    initialDate.getFullYear(),
                    initialDate.getMonth(),
                    initialDate.getDate(),
                    this.props.initialTime.hours,
                    this.props.initialTime.minutes,
                    this.props.initialTime.seconds,
                );
            } else {
                initialDate = this.props.initialTime;
            }
        }

        const currentHours = initialDate.getHours();
        const calculatedHours =
            this.props.mode24hours === true
                ? currentHours
                : currentHours >= 12
                  ? currentHours - 12
                  : currentHours;
        this.setState({
            hours: calculatedHours,
            minutes: initialDate.getMinutes(),
            seconds: initialDate.getSeconds(),
            meridian: currentHours > 12 ? "PM" : "AM",
        });
    }

    public async componentDidUpdate(
        _prevProps: InlineTimePickerProps,
        prevState: InlineTimePickerState,
    ): Promise<void> {
        if (this.state !== prevState) this.invokeOnChangeTime();
    }

    public render(): React.ReactNode {
        return (
            <View style={[containerStyle, this.props.containerStyle]}>
                <View style={timeContainerStyle}>
                    {this.state.updating === undefined && !this.props.mode24hours && (
                        <TouchableOpacity
                            style={{
                                justifyContent: "center",
                                marginRight: 10,
                            }}
                            onPress={(): void => {
                                this.setState({
                                    meridian: this.state.meridian === "AM" ? "PM" : "AM",
                                });
                            }}
                        >
                            <Text
                                style={[
                                    textStyle,
                                    {
                                        color: this.props.theme?.colors?.onSurface,
                                    },
                                    this.getTextStyle(),
                                ]}
                            >
                                {this.state.meridian}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={(): void => this.update("hours")}>
                        <Text style={[textStyle, this.getTextStyle(), this.getFieldStyle("hours")]}>
                            {this.state.hours < 10 ? "0" : ""}
                            {this.state.hours}
                        </Text>
                    </TouchableOpacity>
                    <Text style={[colonStyle, this.getTextColor()]}>{":"}</Text>
                    <TouchableOpacity onPress={(): void => this.update("minutes")}>
                        <Text
                            style={[textStyle, this.getTextStyle(), this.getFieldStyle("minutes")]}
                        >
                            {this.state.minutes < 10 ? "0" : ""}
                            {this.state.minutes}
                        </Text>
                    </TouchableOpacity>
                    {this.mode === "full" && (
                        <Text style={[colonStyle, this.getTextColor()]}>{":"}</Text>
                    )}
                    {this.mode === "full" && (
                        <TouchableOpacity onPress={(): void => this.update("seconds")}>
                            <Text
                                style={[
                                    textStyle,
                                    this.getTextStyle(),
                                    this.getFieldStyle("seconds"),
                                ]}
                            >
                                {this.state.seconds < 10 ? "0" : ""}
                                {this.state.seconds}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                {this.state.updating !== undefined && (
                    <View style={centerStyle}>
                        <TouchableOpacity
                            style={[textStyle, this.getTextStyle(), incrementStyle]}
                            onPress={(): void => this.increment(1)}
                            onLongPress={(): void => this.longIncrement(10)}
                            onPressOut={(): void => this.longIncrement()}
                        >
                            <Ionicons
                                name={"add"}
                                size={this.style.iconSize}
                                color={this.style.textColor}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[textStyle, this.getTextStyle(), incrementStyle]}
                            onPress={(): void => this.increment(-1)}
                            onLongPress={(): void => this.longIncrement(-10)}
                            onPressOut={(): void => this.longIncrement()}
                        >
                            <Ionicons
                                name={"remove"}
                                size={this.style.iconSize}
                                color={this.style.textColor}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }

    private setStyle(theme?: ThemeType): void {
        if (!this.style) {
            this.style = {};
        }
        if (!this.style.activeColor) {
            this.style.activeColor = theme?.colors?.secondary
                ? theme.colors?.secondary
                : TimePickerDefaultStyle.activeColor;
        }
        if (!this.style.backgroundColor) {
            this.style.backgroundColor = theme?.colors?.background
                ? theme?.colors?.background
                : TimePickerDefaultStyle.backgroundColor;
        }
        if (!this.style.borderColor) {
            this.style.borderColor = theme?.colors?.onSurface
                ? theme?.colors?.onSurface
                : TimePickerDefaultStyle.borderColor;
        }
        if (!this.style.borderRadius) {
            this.style.borderRadius = TimePickerDefaultStyle.borderRadius;
        }
        if (!this.style.fontSize) {
            this.style.fontSize = TimePickerDefaultStyle.fontSize;
        }
        if (!this.style.iconSize) {
            this.style.iconSize = TimePickerDefaultStyle.iconSize;
        }
        if (!this.style.textColor) {
            this.style.textColor = theme?.colors?.secondary
                ? theme?.colors?.onSurface
                : TimePickerDefaultStyle.textColor;
        }
    }

    private invokeOnChangeTime = (): void => {
        if (!this.props.onChangeTime) return;
        let h = this.state.hours;
        if (this.state.meridian === "PM" && h !== 12) {
            h = h + 12;
        }
        this.props.onChangeTime(h, this.state.minutes, this.state.seconds);
    };

    private updateHours = (currentHours: number): void => {
        let newHours = currentHours;
        if (this.props.mode24hours === true) {
            newHours = this.calculate24Hours(currentHours);
            this.setState({ hours: newHours });
        } else {
            newHours = this.calculate12Hours(currentHours);
            this.setState({
                hours: newHours,
                meridian: this.getMeridian(newHours),
            });
        }
    };

    private getMeridian = (hours: number): "AM" | "PM" => {
        const meridian = this.state.meridian;
        if (hours > 12) {
            return meridian === "AM" ? "PM" : "AM";
        }
        return meridian;
    };

    private updateMinutes = (minutes: number): void => {
        let tempMinutes = minutes;
        if (minutes > 59) {
            tempMinutes = 0;
            this.updateHours(this.state.hours + 1);
        } else if (minutes < 0) {
            tempMinutes = 59;
            this.updateHours(this.state.hours - 1);
        }
        this.setState({ minutes: tempMinutes });
    };

    private updateSeconds = (seconds: number): void => {
        let tempSeconds = seconds;
        if (seconds > 59) {
            tempSeconds = 0;
            this.updateMinutes(this.state.minutes + 1);
        } else if (seconds < 0) {
            tempSeconds = 59;
            this.updateMinutes(this.state.minutes - 1);
        }
        this.setState({ seconds: tempSeconds });
    };

    private update = (item: TimeField): void => {
        this.setState({
            updating: this.state.updating === item ? undefined : item,
        });
    };

    private increment = (inc: number): void => {
        this.incrementActiveControl(inc);
    };

    private longIncrement = (inc?: number): void => {
        if (inc !== undefined) {
            this.interval = setInterval(() => {
                this.incrementActiveControl(inc);
            }, 500);
        } else {
            clearInterval(this.interval!);
        }
    };

    private calculate12Hours(currentHours: number): number {
        let newHours = currentHours;
        if (currentHours > 12) {
            newHours = 1;
        } else if (currentHours <= 0) {
            newHours = 12;
        }
        return newHours;
    }

    private calculate24Hours(currentHours: number): number {
        let newHours = currentHours;
        if (currentHours > 23) {
            newHours = 0;
        } else if (currentHours < 0) {
            newHours = 23;
        }
        return newHours;
    }

    private incrementActiveControl(inc: number): void {
        if (this.state.updating === "hours") {
            this.updateHours(this.state.hours + inc);
        } else if (this.state.updating === "minutes") {
            this.updateMinutes(this.state.minutes + inc);
        } else if (this.state.updating === "seconds") {
            this.updateSeconds(this.state.seconds + inc);
        }
    }

    /** 選択中のフィールドだけ枠と背景を強調する（旧 setNativeProps の置き換え）。 */
    private getFieldStyle = (field: TimeField): TextStyle => {
        return this.state.updating === field
            ? { backgroundColor: this.style.activeColor, borderWidth: 2 }
            : {};
    };

    private getTextColor = (): TextStyle => {
        return {
            color: this.style.textColor,
        };
    };

    private getTextStyle = (): TextStyle => {
        return {
            fontSize: this.style.fontSize,
            borderRadius: this.style.borderRadius,
            color: this.style.textColor,
            backgroundColor: this.style.backgroundColor,
            borderColor: this.style.borderColor,
        };
    };
}
//#endregion

//#region Styles
const TimePickerDefaultStyle: TimePickerStyle = {
    textColor: "#ddd",
    backgroundColor: "#777",
    activeColor: "#000",
    borderColor: "#555",
    fontSize: 35,
    borderRadius: 4,
    iconSize: 35,
};

const containerStyle: ViewStyle = {
    backgroundColor: "transparent",
    margin: 5,
    marginLeft: 7,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    borderRadius: 4,
};

const timeContainerStyle: ViewStyle = {
    flexDirection: "row",
    marginRight: 5,
};

const centerStyle: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
};

const textStyle: TextStyle = {
    borderWidth: 1,
    paddingHorizontal: 5,
    textAlign: "center",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
};

const incrementStyle: ViewStyle = {
    marginRight: 5,
    padding: 7,
};

const colonStyle: TextStyle = {
    fontSize: 35,
    marginHorizontal: 3,
};
//#endregion
