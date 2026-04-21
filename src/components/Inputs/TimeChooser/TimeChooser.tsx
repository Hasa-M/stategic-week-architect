import {
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import {
    useCallback,
    useEffect,
    useState,
    type KeyboardEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    END_OF_DAY_MINUTES,
    getTimeParts,
    normalizeTimeValue,
    TIME_MINUTE_STEP,
    toTimeValue,
} from "@/lib/grid";
import { cn } from "@/lib/utils";

type TimeChooserProps = {
    id: string;
    value: number;
    onValueChange: (value: number) => void;
    minMinutes?: number;
    maxMinutes?: number;
    disabled?: boolean;
    tone?: "start" | "end";
    className?: string;
};

function padTimeSegment(value: number) {
    return value.toString().padStart(2, "0");
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export default function TimeChooser({
    id,
    value,
    onValueChange,
    minMinutes = 0,
    maxMinutes = END_OF_DAY_MINUTES,
    disabled = false,
    tone = "start",
    className,
}: TimeChooserProps) {
    const normalizedValue = normalizeTimeValue(value, {
        minMinutes,
        maxMinutes,
    });
    const { hours, minutes } = getTimeParts(normalizedValue);
    const [hourInput, setHourInput] = useState(() => padTimeSegment(hours));

    useEffect(() => {
        setHourInput(padTimeSegment(hours));
    }, [hours]);

    const commitValue = useCallback(
        (nextValue: number) => {
            onValueChange(
                normalizeTimeValue(nextValue, {
                    minMinutes,
                    maxMinutes,
                })
            );
        },
        [maxMinutes, minMinutes, onValueChange]
    );

    const adjustHours = useCallback(
        (delta: number) => {
            commitValue(toTimeValue(hours + delta, minutes));
        },
        [commitValue, hours, minutes]
    );

    const adjustMinutes = useCallback(
        (delta: number) => {
            commitValue(normalizedValue + delta);
        },
        [commitValue, normalizedValue]
    );

    const commitHourInput = useCallback(() => {
        const parsedHour = Number(hourInput.trim());

        if (!Number.isFinite(parsedHour)) {
            setHourInput(padTimeSegment(hours));
            return;
        }

        const nextHour = clamp(
            Math.floor(parsedHour),
            0,
            maxMinutes === END_OF_DAY_MINUTES ? 24 : 23
        );

        commitValue(toTimeValue(nextHour, minutes));
    }, [commitValue, hourInput, hours, maxMinutes, minutes]);

    const handleHourKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "ArrowUp") {
                event.preventDefault();
                adjustHours(-1);
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                adjustHours(1);
                return;
            }

            if (event.key === "Enter") {
                event.preventDefault();
                commitHourInput();
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();
                setHourInput(padTimeSegment(hours));
            }
        },
        [adjustHours, commitHourInput, hours]
    );

    const handleMinuteKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "ArrowUp") {
                event.preventDefault();
                adjustMinutes(-TIME_MINUTE_STEP);
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                adjustMinutes(TIME_MINUTE_STEP);
            }
        },
        [adjustMinutes]
    );

    const canIncreaseHours =
        normalizeTimeValue(toTimeValue(hours + 1, minutes), {
            minMinutes,
            maxMinutes,
        }) !== normalizedValue;
    const canDecreaseHours =
        normalizeTimeValue(toTimeValue(hours - 1, minutes), {
            minMinutes,
            maxMinutes,
        }) !== normalizedValue;
    const canIncreaseMinutes =
        normalizeTimeValue(normalizedValue + TIME_MINUTE_STEP, {
            minMinutes,
            maxMinutes,
        }) !== normalizedValue;
    const canDecreaseMinutes =
        normalizeTimeValue(normalizedValue - TIME_MINUTE_STEP, {
            minMinutes,
            maxMinutes,
        }) !== normalizedValue;

    return (
        <div
            className={cn(
                "app-time-chooser",
                tone === "start" ? "app-time-chooser--start" : "app-time-chooser--end",
                className
            )}
        >
            <div className="app-time-chooser__controls">
                <div className="app-time-chooser__segment">
                    <span className="app-time-chooser__segment-label">Hour</span>
                    <div className="app-time-chooser__stepper">
                        <Button
                            type="button"
                            variant="outline"
                            className="app-time-chooser__step-button"
                            onClick={() => adjustHours(-1)}
                            aria-label="Decrease hour"
                            disabled={disabled || !canDecreaseHours}
                        >
                            <ChevronUp className="size-4" />
                        </Button>

                        <Input
                            id={`${id}-hours`}
                            value={hourInput}
                            onChange={(event) =>
                                setHourInput(
                                    event.target.value.replace(/\D/g, "").slice(0, 2)
                                )
                            }
                            onBlur={commitHourInput}
                            onKeyDown={handleHourKeyDown}
                            inputMode="numeric"
                            aria-label="Hour"
                            aria-valuemin={0}
                            aria-valuemax={maxMinutes === END_OF_DAY_MINUTES ? 24 : 23}
                            aria-valuenow={hours}
                            role="spinbutton"
                            disabled={disabled}
                            className="app-time-chooser__value-input"
                        />

                        <Button
                            type="button"
                            variant="outline"
                            className="app-time-chooser__step-button"
                            onClick={() => adjustHours(1)}
                            aria-label="Increase hour"
                            disabled={disabled || !canIncreaseHours}
                        >
                            <ChevronDown className="size-4" />
                        </Button>
                    </div>
                </div>

                <div className="app-time-chooser__separator" aria-hidden="true">
                    :
                </div>

                <div className="app-time-chooser__segment">
                    <span className="app-time-chooser__segment-label">Minutes</span>
                    <div className="app-time-chooser__stepper">
                        <Button
                            type="button"
                            variant="outline"
                            className="app-time-chooser__step-button"
                            onClick={() => adjustMinutes(-TIME_MINUTE_STEP)}
                            aria-label="Decrease minutes by five"
                            disabled={disabled || !canDecreaseMinutes}
                        >
                            <ChevronUp className="size-4" />
                        </Button>

                        <Input
                            id={`${id}-minutes`}
                            value={padTimeSegment(minutes)}
                            readOnly
                            onKeyDown={handleMinuteKeyDown}
                            aria-label="Minutes"
                            aria-valuemin={0}
                            aria-valuemax={55}
                            aria-valuenow={minutes}
                            role="spinbutton"
                            disabled={disabled}
                            className="app-time-chooser__value-input"
                        />

                        <Button
                            type="button"
                            variant="outline"
                            className="app-time-chooser__step-button"
                            onClick={() => adjustMinutes(TIME_MINUTE_STEP)}
                            aria-label="Increase minutes by five"
                            disabled={disabled || !canIncreaseMinutes}
                        >
                            <ChevronDown className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}