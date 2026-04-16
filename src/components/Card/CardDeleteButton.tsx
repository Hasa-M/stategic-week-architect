import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type CardDeleteButtonProps = {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function CardDeleteButton({
    onClick,
}: CardDeleteButtonProps) {
    return (
        <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="absolute -top-2 -right-2 rounded-full bg-surface opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:border-destructive hover:bg-red-50"
            onClick={onClick}
        >
            <Trash2 size={14} className="text-destructive" />
            <span className="sr-only">Delete</span>
        </Button>
    );
}