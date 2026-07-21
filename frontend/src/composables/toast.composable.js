import { reactive } from "vue";

export const toastState = reactive({
  toasts: [],
});

let id = 0;

export function showToast({
  message,
  type = "info",
  duration = 5000,
}) {
  toastState.toasts.push({
    id: ++id,
    message,
    type,
    duration,
  });
}

export function removeToast(id) {
  const index = toastState.toasts.findIndex((t) => t.id === id);

  if (index !== -1) {
    toastState.toasts.splice(index, 1);
  }
}