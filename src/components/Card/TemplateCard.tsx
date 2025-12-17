export default function TemplateCard({
    colorClass,
    label,
}: {
    colorClass: string;
    label: string;
}) {
    return (
        <li
            className="h-8 bg-white flex rounded-sm pr-3 gap-3 shadow-sm hover:bg-background-accent transition duration-300 ease-in-out cursor-pointer disabled:cursor-not-allowed"
            onClick={() => alert("Edit/Delete dialog coming soon...")}
        >
            <div
                className={`w-1.5 self-stretch rounded-full shrink-0 ${colorClass}`}
            />
            <span className="flex-1 font-medium leading-7 self-center truncate">
                {label}
            </span>
        </li>
    );
}
