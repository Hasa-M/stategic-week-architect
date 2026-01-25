import { useScheduleContext } from "@/context/hooks";

/**
 * ScheduleGrid - Main weekly calendar grid
 *
 * TODO: Implement the grid with:
 * 1. Column headers for each day (Monday - Sunday)
 * 2. Row headers for time slots (based on grid.slotDuration)
 * 3. Grid cells where activities can be placed
 * 4. ActivityBlock components for each PlacedActivity
 *
 * Data available from context:
 * - schedule.grid.days: Array of days to show
 * - schedule.grid.slotDuration: Minutes per slot (15, 30, 60, etc.)
 * - schedule.grid.startTime: Start time in minutes (e.g., 480 = 8:00 AM)
 * - schedule.grid.endTime: End time in minutes (e.g., 1200 = 8:00 PM)
 * - schedule.placedActivities: Record of activities placed on grid
 *
 * Time calculation helpers:
 * - Minutes to time: 480 minutes = 8:00 AM (480/60 = 8 hours)
 * - Row index: (activityStartTime - gridStartTime) / slotDuration
 * - Activity height: (endTime - startTime) / slotDuration * rowHeight
 */
export default function ScheduleGrid() {
    const schedule = useScheduleContext();

    // Get grid configuration
    const days = schedule?.grid.days ?? [];
    const slotDuration = schedule?.grid.slotDuration ?? 30;
    const startTime = schedule?.grid.startTime ?? 480; // 8:00 AM
    const endTime = schedule?.grid.endTime ?? 1200; // 8:00 PM

    // Calculate time slots
    const totalMinutes = endTime - startTime;
    const numberOfSlots = totalMinutes / slotDuration;

    // Helper to convert minutes to time string
    const minutesToTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}:${mins.toString().padStart(2, "0")}`;
    };

    // Generate time slot labels
    const timeSlots = Array.from({ length: numberOfSlots }, (_, i) => {
        const slotMinutes = startTime + i * slotDuration;
        return minutesToTime(slotMinutes);
    });

    return (
        <div className="border rounded-lg overflow-hidden">
            {/* Grid Header - Day columns */}
            <div
                className="grid bg-gray-50 border-b"
                style={{
                    gridTemplateColumns: `60px repeat(${days.length}, 1fr)`,
                }}
            >
                {/* Empty corner cell */}
                <div className="p-2 border-r" />

                {/* Day headers */}
                {days.map((day) => (
                    <div
                        key={day}
                        className="p-2 text-center font-medium text-sm border-r last:border-r-0"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid Body - Time rows */}
            <div className="relative">
                {timeSlots.map((time, rowIndex) => (
                    <div
                        key={time}
                        className="grid border-b last:border-b-0"
                        style={{
                            gridTemplateColumns: `60px repeat(${days.length}, 1fr)`,
                            minHeight: "60px",
                        }}
                    >
                        {/* Time label */}
                        <div className="p-2 text-xs text-gray-500 border-r bg-gray-50">
                            {time}
                        </div>

                        {/* Day cells */}
                        {days.map((day) => (
                            <div
                                key={`${day}-${rowIndex}`}
                                className="border-r last:border-r-0 relative"
                            >
                                {/*
                                    TODO: Render ActivityBlock components here
                                    Filter placedActivities by day and time slot
                                    Calculate position and height based on start/end times
                                */}
                            </div>
                        ))}
                    </div>
                ))}

                {/*
                    TODO: Overlay PlacedActivities here with absolute positioning
                    Each ActivityBlock should be positioned based on:
                    - left: column index * column width
                    - top: row index * row height
                    - height: duration in slots * row height
                */}
            </div>

            {/* Placeholder message */}
            <div className="p-8 text-center text-gray-400 text-sm">
                <p>Grid structure ready!</p>
                <p className="mt-2">
                    TODO: Implement ActivityBlock component and render placed
                    activities
                </p>
                <p className="mt-1 text-xs">
                    Days: {days.join(", ")} | Slot: {slotDuration}min | Time:{" "}
                    {minutesToTime(startTime)} - {minutesToTime(endTime)}
                </p>
            </div>
        </div>
    );
}
