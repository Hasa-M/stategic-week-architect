export const modalOverlayClassName = [
    "fixed inset-0 z-50 bg-slate-900/18 backdrop-blur-sm",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
].join(" ");

export const modalContentClassName = [
    "app-scrollbar fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] translate-x-[-50%] -translate-y-1/2 gap-4 overflow-y-auto overscroll-contain rounded-4xl border border-white/80 bg-linear-to-b from-white/96 via-white/90 to-sky-50/72 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl duration-200 sm:max-w-lg sm:p-7",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
].join(" ");