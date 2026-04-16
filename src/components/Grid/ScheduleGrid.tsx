import { useMemo } from "react";

import { useScheduleContext } from "@/context/hooks";
import { getColorStyles } from "@/utils";

const SLOT_HEIGHT = 56;
const TIME_COLUMN_WIDTH = 84;

function formatMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;
}

export default function ScheduleGrid() {
    const schedule = useScheduleContext();
    const { days, slotDuration, startTime, endTime } = schedule.grid;

    const slotTimes = useMemo(() => {
        const totalSlots = Math.ceil((endTime - startTime) / slotDuration);

        return Array.from({ length: totalSlots }, (_, index) => {
            const minutes = startTime + index * slotDuration;
            return {
                label: formatMinutes(minutes),
                minutes,
            };
        });
    }, [endTime, slotDuration, startTime]);

    const visibleActivities = useMemo(
        () =>
            Object.values(schedule.placedActivities).filter((activity) =>
                days.includes(activity.day)
            ),
        [days, schedule.placedActivities]
    );

    const columnHeight = slotTimes.length * SLOT_HEIGHT;

    return (
        <div className="bg-surface overflow-x-auto rounded-2xl border border-primary/10 shadow-sm">
            <div
                className="grid min-w-190"
                style={{
                    gridTemplateColumns: `${TIME_COLUMN_WIDTH}px repeat(${days.length}, minmax(0, 1fr))`,
                }}
            >
                <div className="bg-background border-b border-r border-primary/10 p-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Time
                </div>
                {days.map((day) => (
                    <div
                        key={day}
                        className="bg-background border-b border-primary/10 p-3 text-sm font-semibold text-gray-700"
                    >
                        {day}
                    </div>
                ))}

                <div className="border-r border-primary/10 bg-background/70">
                    {slotTimes.map((slot) => (
                        <div
                            key={slot.minutes}
                            className="border-b border-primary/10 px-3 py-2 text-xs text-gray-500"
                            style={{ height: SLOT_HEIGHT }}
                        >
                            {slot.label}
                        </div>
                    ))}
                </div>

                {days.map((day) => {
                    const dayActivities = visibleActivities.filter(
                        (activity) => activity.day === day
                    );

                    return (
                        <div
                            key={day}
                            className="relative border-l border-primary/10"
                            style={{ height: columnHeight }}
                        >
                            {slotTimes.map((slot) => (
                                <div
                                    key={`${day}-${slot.minutes}`}
                                    className="border-b border-primary/10"
                                    style={{ height: SLOT_HEIGHT }}
                                />
                            ))}

                            {dayActivities.map((activity) => {
                                const top =
                                    ((activity.startTime - startTime) / slotDuration) *
                                    SLOT_HEIGHT;
                                const height = Math.max(
                                    ((activity.endTime - activity.startTime) /
                                        slotDuration) *
                                        SLOT_HEIGHT -
                                        6,
                                    SLOT_HEIGHT * 0.85
                                );
                                const colorStyles = getColorStyles(activity.color);

                                return (
                                    <div
                                        key={activity.placedId}
                                        className={`${colorStyles.soft} ${colorStyles.border} absolute left-2 right-2 overflow-hidden rounded-xl border px-3 py-2 shadow-sm`}
                                        style={{ top: top + 3, height }}
                                    >
                                        <div className={`text-sm font-semibold ${colorStyles.text}`}>
                                            {activity.title}
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {formatMinutes(activity.startTime)} -{" "}
                                            {formatMinutes(activity.endTime)}
                                        </p>
                                        {height >= SLOT_HEIGHT * 1.5 && (
                                            <p className="mt-2 line-clamp-2 text-xs text-gray-600">
                                                {activity.description}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}

                            {dayActivities.length === 0 && (
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-gray-300">
                                    No activities
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
