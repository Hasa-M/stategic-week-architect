import {
    CalendarDays,
    Clock3,
    LayoutGrid,
    SlidersHorizontal,
    StickyNote,
} from "lucide-react";
import { useMemo } from "react";

import SidebarSectionHeader from "@/components/Sidebar/SidebarSectionHeader";
import { Button } from "@/components/ui/button";
import { useScheduleContext, useUserContext } from "@/context/hooks";
import { clipActivityToVisibleRange } from "@/lib/grid";
import { cn } from "@/lib/utils";

export default function SummaryDashboard({
    continuousScroll = false,
}: {
    continuousScroll?: boolean;
}) {
    const schedule = useScheduleContext();
    const user = useUserContext();
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
    const recentTemplates = Object.values(user.templates).slice(0, 4);

    return (
        <div
            className={cn(
                "flex flex-col gap-3 p-1",
                !continuousScroll && "h-full min-h-0"
            )}
        >
            <SidebarSectionHeader
                title="Summary Dashboard"
                action={
                    <span
                        className="inline-flex"
                        title="Widget editing is not available yet."
                    >
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="size-8 rounded-full bg-surface text-(--app-text-soft) shadow-none"
                            aria-label="Edit dashboard widgets"
                            disabled
                        >
                            <SlidersHorizontal className="size-4" />
                        </Button>
                    </span>
                }
            />

            <div
                className={cn(
                    continuousScroll
                        ? "flex flex-col gap-3"
                        : "app-scrollbar min-h-0 flex-1 overflow-y-auto pr-1"
                )}
            >
                <div
                    className={cn(
                        "flex flex-col gap-3 pb-1",
                        !continuousScroll && "min-h-full"
                    )}
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="app-card p-3">
                            <div className="app-text-muted flex items-center gap-2 text-sm">
                                <Clock3 className="size-4" />
                                Planned hours
                            </div>
                            <p className="app-text-strong mt-2 text-2xl font-semibold">
                                {totalPlannedHours.toFixed(1)}h
                            </p>
                        </div>

                        <div className="app-card p-3">
                            <div className="app-text-muted flex items-center gap-2 text-sm">
                                <LayoutGrid className="size-4" />
                                Templates
                            </div>
                            <p className="app-text-strong mt-2 text-2xl font-semibold">
                                {Object.keys(user.templates).length}
                            </p>
                        </div>

                        <div className="app-card p-3">
                            <div className="app-text-muted flex items-center gap-2 text-sm">
                                <CalendarDays className="size-4" />
                                Busiest day
                            </div>
                            <p className="app-text-strong mt-2 text-lg font-semibold">
                                {busiestDay.day}
                            </p>
                            <p className="app-text-muted text-sm">
                                {busiestDay.hours.toFixed(1)} scheduled hours
                            </p>
                        </div>

                        <div className="app-card p-3">
                            <div className="app-text-muted flex items-center gap-2 text-sm">
                                <StickyNote className="size-4" />
                                Notes
                            </div>
                            <p className="app-text-strong mt-2 text-2xl font-semibold">
                                {Object.keys(schedule.notes).length}
                            </p>
                        </div>
                    </div>

                    <div className="app-card p-3">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="app-text-strong font-semibold">Visible week breakdown</h3>
                            <span className="app-text-muted text-sm">
                                {visibleDays.length} day{visibleDays.length === 1 ? "" : "s"}
                            </span>
                        </div>
                        <ul className="space-y-3">
                            {hoursByDay.map(({ day, hours }) => (
                                <li key={day} className="flex items-center justify-between text-sm">
                                    <span>{day}</span>
                                    <span className="app-text-soft font-medium">
                                        {hours.toFixed(1)}h
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="app-card p-3">
                        <h3 className="app-text-strong mb-3 font-semibold">Recent templates</h3>
                        {recentTemplates.length === 0 ? (
                            <p className="app-text-muted text-sm">
                                Create a template to start planning your week.
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {recentTemplates.map((template) => (
                                    <li key={template.templateId} className="app-text-soft text-sm">
                                        {template.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
