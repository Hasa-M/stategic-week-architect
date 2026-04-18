import { Plus } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useDispatch, useScheduleContext } from "@/context/hooks";
import type { Day, PlacedActivityDraft, SlotWindow } from "@/types";
import PlaceActivityModal from "./PlaceActivityModal";

const ALL_DAYS: Day[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const SLOT_OPTIONS: { value: SlotWindow; label: string }[] = [
    { value: 15, label: "15 min" },
    { value: 30, label: "30 min" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "90 min" },
    { value: 120, label: "2 hours" },
    { value: 150, label: "2.5 hours" },
    { value: 180, label: "3 hours" },
    { value: 240, label: "4 hours" },
];

function formatMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;
}

export default function GridToolbar() {
    const schedule = useScheduleContext();
    const dispatch = useDispatch();

    const templateOptions = useMemo(
        () =>
            Object.values(schedule.templates).map((template) => ({
                value: template.templateId,
                label: template.title,
                color: template.color,
            })),
        [schedule.templates]
    );

    const timeOptions = useMemo(() => {
        const options: { value: string; label: string }[] = [];

        for (
            let minutes = schedule.grid.startTime;
            minutes <= schedule.grid.endTime;
            minutes += schedule.grid.slotDuration
        ) {
            options.push({
                value: String(minutes),
                label: formatMinutes(minutes),
            });
        }

        return options;
    }, [schedule.grid.endTime, schedule.grid.slotDuration, schedule.grid.startTime]);

    const toggleDay = (day: Day) => {
        const selectedDays = schedule.grid.days;
        const isSelected = selectedDays.includes(day);

        if (isSelected && selectedDays.length === 1) {
            return;
        }

        const nextDays = isSelected
            ? selectedDays.filter((selectedDay) => selectedDay !== day)
            : ALL_DAYS.filter((candidate) =>
                  [...selectedDays, day].includes(candidate)
              );

        dispatch({ type: "SET_GRID_DAYS", payload: nextDays });
    };

    const handleSlotDurationChange = (value: string) => {
        dispatch({
            type: "SET_GRID_SLOT_DURATION",
            payload: Number(value) as SlotWindow,
        });
    };

    const handlePlaceActivity = (data: PlacedActivityDraft) => {
        dispatch({
            type: "PLACE_ACTIVITY",
            payload: data,
        });
    };

    return (
        <div className="flex flex-col gap-4 py-1 xl:flex-row xl:items-center">
            <div className="app-panel-muted flex flex-1 flex-wrap items-center gap-2 p-3.5">
                <span className="mr-2 text-sm font-medium text-slate-500">
                    Visible days
                </span>
                {ALL_DAYS.map((day) => {
                    const isSelected = schedule.grid.days.includes(day);

                    return (
                        <Button
                            key={day}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className="rounded-full"
                            onClick={() => toggleDay(day)}
                        >
                            {day.slice(0, 3)}
                        </Button>
                    );
                })}
            </div>

            <div className="app-panel-muted flex flex-1 items-center gap-3 p-3.5">
                <span className="shrink-0 text-sm font-medium text-slate-500">
                    Slot size
                </span>
                <Select
                    id="slot-duration"
                    name="slotDuration"
                    value={String(schedule.grid.slotDuration)}
                    onValueChange={handleSlotDurationChange}
                    options={SLOT_OPTIONS.map((option) => ({
                        value: String(option.value),
                        label: option.label,
                    }))}
                    className="max-w-44"
                />
            </div>

            {templateOptions.length === 0 ? (
                <Button
                    className="rounded-full"
                    disabled
                    title="Create at least one template before placing activities on the grid."
                >
                    <Plus size={16} />
                    Add Activity
                </Button>
            ) : (
                <PlaceActivityModal
                    templateOptions={templateOptions}
                    timeOptions={timeOptions}
                    onSubmit={handlePlaceActivity}
                >
                    <Button className="rounded-full">
                        <Plus size={16} />
                        Add Activity
                    </Button>
                </PlaceActivityModal>
            )}
        </div>
    );
}
