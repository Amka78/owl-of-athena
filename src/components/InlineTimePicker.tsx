import React, { Component } from "react";
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    ViewStyle,
    TextStyle
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type TimePickerStyle = {
    textColor?: string;
    backgroundColor?: string;
    containerBackgroudColor?: string;
    activeColor?: string;
    borderColor?: string;
    fontSize?: number;
    borderRadius?: number;
    iconSize?: number;
};

const TimePickerDefaultStyle: TimePickerStyle = {
    textColor: "#ddd",
    backgroundColor: "#777",
    containerBackgroudColor: "#555",
    activeColor: "#000",
    borderColor: "#555",
    fontSize: 35,
    borderRadius: 4,
    iconSize: 35
};

type TimePickerMode = "full" | "minute";

type InlineTimePickerProps = {
    style?: TimePickerStyle;
    initialTime?: Date | { hours: number; minutes: number; seconds: number };
    onChangeTime?: (hours?: number, minutes?: number, seconds?: number) => void;
    mode24hours?: boolean;
    mode?: TimePickerMode;
};

type InlineTimePickerState = {
    hours: number;
    minutes: number;
    seconds: number;
    meridian: "AM" | "PM";
    updating?: Text;
};

export class InlineTimePicker extends Component<
    InlineTimePickerProps,
    InlineTimePickerState
> {
    private style: TimePickerStyle;

    private hoursText?: Text;

    private minutesText?: Text;

    private secondsText?: Text;

    private interval?: NodeJS.Timeout;

    private mode?: TimePickerMode;
    constructor(props: InlineTimePickerProps) {
        super(props);

        console.debug("InlineTimePickerProps:", props);
        this.state = {
            hours: 12,
            minutes: 0,
            seconds: 0,
            meridian: "AM",
            updating: undefined
        };
        this.hoursText = undefined;
        this.minutesText = undefined;
        this.secondsText = undefined;
        this.interval = undefined;

        this.mode = "full";
        if (this.props.mode) {
            this.mode = this.props.mode!;
        }

        this.style = TimePickerDefaultStyle;
        if (this.props.style) {
            this.style = this.props.style!;

            this.setStyle();
        }
    }

    public async componentDidMount(): Promise<void> {
        let initialDate = new Date();

        if (this.props.initialTime !== undefined) {
            if ("hours" in this.props.initialTime) {
                initialDate = new Date(
                    initialDate.getFullYear(),
                    initialDate.getMonth(),
                    initialDate.getDate(),
                    this.props.initialTime!.hours,
                    this.props.initialTime!.minutes,
                    this.props.initialTime!.seconds
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
            meridian: currentHours > 12 ? "PM" : "AM"
        });
    }

    public async componentDidUpdate(
        _prevProps: InlineTimePickerProps,
        prevState: InlineTimePickerState
    ): Promise<void> {
        if (this.state !== prevState) this.invokeOnChangeTime();
    }

    public render(): JSX.Element {
        return (
            <View>
                <View style={[styles.container, this.getContainerColor()]}>
                    <View style={styles.timeContainer}>
                        {this.state.updating === undefined &&
                            !this.props.mode24hours && (
                                <TouchableOpacity
                                    style={{
                                        justifyContent: "center",
                                        marginRight: 10
                                    }}
                                    onPress={(): void => {
                                        this.setState({
                                            meridian:
                                                this.state.meridian === "AM"
                                                    ? "PM"
                                                    : "AM"
                                        });
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.text,
                                            this.getTextStyle()
                                        ]}
                                    >
                                        {this.state.meridian}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        <TouchableOpacity
                            onPress={(): void => this.update(this.hoursText!)}
                        >
                            <Text
                                style={[styles.text, this.getTextStyle()]}
                                ref={(c): void => {
                                    this.hoursText = c!;
                                }}
                            >
                                {this.state.hours < 10 ? "0" : ""}
                                {this.state.hours}
                            </Text>
                        </TouchableOpacity>
                        <Text style={[styles.colon, this.getTextColor()]}>
                            {":"}
                        </Text>
                        <TouchableOpacity
                            onPress={(): void => this.update(this.minutesText!)}
                        >
                            <Text
                                style={[styles.text, this.getTextStyle()]}
                                ref={(c): void => {
                                    this.minutesText = c!;
                                }}
                            >
                                {this.state.minutes < 10 ? "0" : ""}
                                {this.state.minutes}
                            </Text>
                        </TouchableOpacity>
                        {this.mode === "full" && (
                            <Text style={[styles.colon, this.getTextColor()]}>
                                {":"}
                            </Text>
                        )}
                        {this.mode === "full" && (
                            <TouchableOpacity
                                onPress={(): void =>
                                    this.update(this.secondsText!)
                                }
                            >
                                <Text
                                    style={[styles.text, this.getTextStyle()]}
                                    ref={(c): void => {
                                        this.secondsText = c!;
                                    }}
                                >
                                    {this.state.seconds < 10 ? "0" : ""}
                                    {this.state.seconds}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {this.state.updating !== undefined && (
                        <View style={styles.center}>
                            <TouchableOpacity
                                style={[
                                    styles.text,
                                    this.getTextStyle(),
                                    styles.increment
                                ]}
                                onPress={(): void => this.increment(1)}
                                onLongPress={(): void => this.longIncrement(10)}
                                onPressOut={(): void => this.longIncrement()}
                            >
                                <Ionicons
                                    name={"md-add"}
                                    size={this.style.iconSize}
                                    color={this.style.textColor}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.text,
                                    this.getTextStyle(),
                                    styles.increment
                                ]}
                                onPress={(): void => this.increment(-1)}
                                onLongPress={(): void =>
                                    this.longIncrement(-10)
                                }
                                onPressOut={(): void => this.longIncrement()}
                            >
                                <Ionicons
                                    name={"md-remove"}
                                    size={this.style.iconSize}
                                    color={this.style.textColor}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        );
    }

    private setStyle(): void {
        console.debug("currentStyle:", this.style);
        if (!this.style.activeColor) {
            this.style.activeColor = TimePickerDefaultStyle.activeColor;
        }
        if (!this.style.backgroundColor) {
            this.style.backgroundColor = TimePickerDefaultStyle.backgroundColor;
        }
        if (!this.style.borderColor) {
            this.style.borderColor = TimePickerDefaultStyle.borderColor;
        }
        if (!this.style.borderRadius) {
            this.style.borderRadius = TimePickerDefaultStyle.borderRadius;
        }
        if (!this.style.containerBackgroudColor) {
            this.style.containerBackgroudColor =
                TimePickerDefaultStyle.containerBackgroudColor;
        }
        if (!this.style.fontSize) {
            this.style.fontSize = TimePickerDefaultStyle.fontSize;
        }
        if (!this.style.iconSize) {
            this.style.iconSize = TimePickerDefaultStyle.iconSize;
        }
        if (!this.style.textColor) {
            this.style.textColor = TimePickerDefaultStyle.textColor;
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
                meridian: this.getMeridian(newHours)
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

    private update = (item: Text): void => {
        if (this.state.updating === item) {
            this.setState({ updating: undefined });
            this.updateStyle(item, false);
        } else {
            if (this.state.updating !== undefined) {
                this.updateStyle(this.state.updating, false);
            }
            this.updateStyle(item, true);
            this.setState({ updating: item });
        }
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
        if (this.state.updating === this.hoursText) {
            this.updateHours(this.state.hours + inc);
        } else if (this.state.updating === this.minutesText) {
            this.updateMinutes(this.state.minutes + inc);
        } else if (this.state.updating === this.secondsText) {
            this.updateSeconds(this.state.seconds + inc);
        }
    }
    private updateStyle(target: Text, isActive: boolean): void {
        target.setNativeProps({
            style: {
                backgroundColor: isActive
                    ? this.style.activeColor
                    : this.style.backgroundColor,
                borderWidth: isActive ? 2 : 1
            }
        });
    }

    private getContainerColor = (): ViewStyle => {
        return {
            backgroundColor: this.style.containerBackgroudColor
        };
    };

    private getTextColor = (): TextStyle => {
        return { color: this.style.textColor };
    };

    private getTextStyle = (): TextStyle => {
        return {
            fontSize: this.style.fontSize,
            borderRadius: this.style.borderRadius,
            color: this.style.textColor,
            backgroundColor: this.style.backgroundColor,
            borderColor: this.style.borderColor
        };
    };
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        marginLeft: 7,
        //width: "auto",
        flex: 1,
        height: 70,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        alignContent: "center",
        borderRadius: 4
    },
    timeContainer: {
        flexDirection: "row",
        margin: 5
    },
    center: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    text: {
        borderWidth: 1,
        paddingHorizontal: 5,
        textAlign: "center",
        justifyContent: "space-around",
        alignItems: "center",
        alignContent: "center"
    },
    increment: {
        marginRight: 5,
        padding: 7
    },
    colon: {
        fontSize: 35,
        marginHorizontal: 3
    },
    meridian: {
        position: "absolute",
        top: 0,
        left: 5
    },
    meridian_text: {
        fontSize: 16
    }
});
