export const modalOverlayClassName = [
    "app-modal-overlay fixed inset-0 z-50 backdrop-blur-sm",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
].join(" ");

export const modalContentClassName = [
    "app-modal-content app-scrollbar fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] translate-x-[-50%] -translate-y-1/2 gap-4 overflow-y-auto overscroll-contain rounded-4xl border p-6 backdrop-blur-xl duration-200 sm:max-w-lg sm:p-7",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
].join(" ");