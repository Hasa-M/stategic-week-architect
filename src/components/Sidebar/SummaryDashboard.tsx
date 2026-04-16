import { CalendarDays, Clock3, LayoutGrid, StickyNote } from "lucide-react";

import { useScheduleContext } from "@/context/hooks";

export default function SummaryDashboard() {
    const schedule = useScheduleContext();
    const visibleDays = schedule.grid.days;
    const placedActivities = Object.values(schedule.placedActivities).filter(
        (activity) => visibleDays.includes(activity.day)
    );
    const totalPlannedHours = placedActivities.reduce(
        (total, activity) => total + (activity.endTime - activity.startTime) / 60,
        0
    );
    const hoursByDay = visibleDays.map((day) => {
        const hours = placedActivities
            .filter((activity) => activity.day === day)
            .reduce(
                (total, activity) =>
                    total + (activity.endTime - activity.startTime) / 60,
                0
            );

        return { day, hours };
    });
    const busiestDay =
        hoursByDay.reduce(
            (current, next) => (next.hours > current.hours ? next : current),
            { day: visibleDays[0] ?? "Monday", hours: 0 }
        ) ?? null;
    const recentTemplates = Object.values(schedule.templates).slice(0, 4);

    return (
        <div className="flex h-full flex-col gap-4">
            <div className="rounded-2xl bg-primary p-5 text-on-primary shadow-sm">
                <p className="text-sm opacity-80">Weekly overview</p>
                <p className="mt-1 text-2xl font-bold">{schedule.name}</p>
                <p className="mt-3 text-sm opacity-90">
                    {placedActivities.length} planned activities across {visibleDays.length}{" "}
                    visible days
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="bg-surface rounded-xl p-4 shadow-sm">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Clock3 className="size-4" />
                        Planned hours
                    </div>
                    <p className="mt-2 text-2xl font-semibold">
                        {totalPlannedHours.toFixed(1)}h
                    </p>
                </div>

                <div className="bg-surface rounded-xl p-4 shadow-sm">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <LayoutGrid className="size-4" />
                        Templates
                    </div>
                    <p className="mt-2 text-2xl font-semibold">
                        {Object.keys(schedule.templates).length}
                    </p>
                </div>

                <div className="bg-surface rounded-xl p-4 shadow-sm">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <CalendarDays className="size-4" />
                        Busiest day
                    </div>
                    <p className="mt-2 text-lg font-semibold">
                        {busiestDay.day}
                    </p>
                    <p className="text-sm text-gray-500">
                        {busiestDay.hours.toFixed(1)} scheduled hours
                    </p>
                </div>

                <div className="bg-surface rounded-xl p-4 shadow-sm">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <StickyNote className="size-4" />
                        Notes
                    </div>
                    <p className="mt-2 text-2xl font-semibold">
                        {Object.keys(schedule.notes).length}
                    </p>
                </div>
            </div>

            <div className="bg-surface rounded-xl p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Visible week breakdown</h3>
                    <span className="text-sm text-gray-500">
                        {visibleDays.length} day{visibleDays.length === 1 ? "" : "s"}
                    </span>
                </div>
                <ul className="space-y-3">
                    {hoursByDay.map(({ day, hours }) => (
                        <li key={day} className="flex items-center justify-between text-sm">
                            <span>{day}</span>
                            <span className="font-medium text-gray-600">
                                {hours.toFixed(1)}h
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-surface rounded-xl p-4 shadow-sm">
                <h3 className="mb-3 font-semibold">Recent templates</h3>
                {recentTemplates.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        Create a template to start planning your week.
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {recentTemplates.map((template) => (
                            <li key={template.templateId} className="text-sm text-gray-600">
                                {template.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
