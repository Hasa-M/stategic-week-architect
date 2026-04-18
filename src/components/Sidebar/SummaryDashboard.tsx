import { CalendarDays, Clock3, LayoutGrid, StickyNote } from "lucide-react";
import { useMemo } from "react";

import { useScheduleContext } from "@/context/hooks";
import { clipActivityToVisibleRange } from "@/lib/grid";

export default function SummaryDashboard() {
    const schedule = useScheduleContext();
    const visibleDays = schedule.grid.days;
    const visibleActivities = useMemo(
        () =>
            Object.values(schedule.placedActivities)
                .filter((activity) => visibleDays.includes(activity.day))
                .map((activity) =>
                    clipActivityToVisibleRange(
                        activity,
                        schedule.grid.startTime,
                        schedule.grid.endTime
                    )
                )
                .filter((activity) => activity !== null),
        [
            schedule.grid.endTime,
            schedule.grid.startTime,
            schedule.placedActivities,
            visibleDays,
        ]
    );
    const totalPlannedHours = visibleActivities.reduce(
        (total, activity) =>
            total + (activity.visibleEndTime - activity.visibleStartTime) / 60,
        0
    );
    const hoursByDay = visibleDays.map((day) => {
        const hours = visibleActivities
            .filter((activity) => activity.day === day)
            .reduce(
                (total, activity) =>
                    total +
                    (activity.visibleEndTime - activity.visibleStartTime) / 60,
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
        <div className="app-scrollbar flex h-full min-h-0 flex-col gap-4 overflow-y-auto pr-1">
            <div className="app-panel-muted p-5 text-slate-700">
                <p className="app-badge w-fit">Weekly Overview</p>
                <p className="mt-4 text-2xl font-bold tracking-tight text-slate-800">
                    {schedule.name}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                    {visibleActivities.length} visible activit{visibleActivities.length === 1 ? "y" : "ies"} across {visibleDays.length}{" "}
                    visible day{visibleDays.length === 1 ? "" : "s"}
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="app-card p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock3 className="size-4" />
                        Planned hours
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-slate-800">
                        {totalPlannedHours.toFixed(1)}h
                    </p>
                </div>

                <div className="app-card p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <LayoutGrid className="size-4" />
                        Templates
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-slate-800">
                        {Object.keys(schedule.templates).length}
                    </p>
                </div>

                <div className="app-card p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays className="size-4" />
                        Busiest day
                    </div>
                    <p className="mt-2 text-lg font-semibold text-slate-800">
                        {busiestDay.day}
                    </p>
                    <p className="text-sm text-slate-500">
                        {busiestDay.hours.toFixed(1)} scheduled hours
                    </p>
                </div>

                <div className="app-card p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <StickyNote className="size-4" />
                        Notes
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-slate-800">
                        {Object.keys(schedule.notes).length}
                    </p>
                </div>
            </div>

            <div className="app-card p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Visible week breakdown</h3>
                    <span className="text-sm text-slate-500">
                        {visibleDays.length} day{visibleDays.length === 1 ? "" : "s"}
                    </span>
                </div>
                <ul className="space-y-3">
                    {hoursByDay.map(({ day, hours }) => (
                        <li key={day} className="flex items-center justify-between text-sm">
                            <span>{day}</span>
                            <span className="font-medium text-slate-600">
                                {hours.toFixed(1)}h
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="app-card p-4">
                <h3 className="mb-3 font-semibold text-slate-800">Recent templates</h3>
                {recentTemplates.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        Create a template to start planning your week.
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {recentTemplates.map((template) => (
                            <li key={template.templateId} className="text-sm text-slate-600">
                                {template.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
