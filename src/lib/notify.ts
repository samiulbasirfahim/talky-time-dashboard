import toast from "react-hot-toast";

export function notify(message: string) {
    toast.success(message, {
        position: "top-right",
        duration: 3000,
    });
}