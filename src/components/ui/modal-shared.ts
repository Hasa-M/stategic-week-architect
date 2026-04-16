export const modalOverlayClassName = [
    "fixed inset-0 z-50 bg-black/30",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
].join(" ");

export const modalContentClassName = [
    "bg-surface fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] -translate-y-1/2 gap-4 rounded-lg p-6 shadow-lg duration-200 sm:max-w-lg",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
].join(" ");