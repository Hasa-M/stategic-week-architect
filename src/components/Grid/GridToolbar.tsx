import { Plus } from "lucide-react";
import { WeeklyAppButton } from "../Button/Button";

/**
 * GridToolbar - Toolbar above the schedule grid
 *
 * TODO: Implement these features:
 * 1. Day filter chips - Toggle which days to show (Mon-Sun)
 * 2. Time slot/duration selector - Choose slot duration (15, 30, 60, etc.)
 * 3. Add Activity button - Opens modal to place activity on grid
 *
 * Design reference:
 * - Two rounded pill containers side by side
 * - Left: "Component for choosing days" (day chips)
 * - Right: "Component for choosing time slots and duration"
 * - Green "Add Activity" button on the right
 */
export default function GridToolbar() {
    return (
        <div className="flex flex-row items-center gap-4 py-4">
            {/* TODO: Day Filter Component */}
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-500">
                Component for choosing days
                {/*
                    TODO: Implement day chips like:
                    <DayChip day="Monday" selected={true} onClick={...} />
                    <DayChip day="Tuesday" selected={true} onClick={...} />
                    etc.
                */}
            </div>

            {/* TODO: Time Slot Selector Component */}
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-500">
                Component for choosing time slots and duration
                {/*
                    TODO: Implement time slot selector like:
                    <Select
                        options={[
                            { value: "15", label: "15 min" },
                            { value: "30", label: "30 min" },
                            { value: "60", label: "1 hour" },
                            etc.
                        ]}
                        onChange={...}
                    />
                */}
            </div>

            {/* Add Activity Button */}
            <WeeklyAppButton className="rounded-full">
                <Plus size={16} />
                Add Activity
            </WeeklyAppButton>
        </div>
    );
}
