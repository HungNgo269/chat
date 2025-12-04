import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  formatDistanceToNow,
} from "date-fns";
import { vi } from "date-fns/locale";
import { format } from "date-fns";

export function formatTimeFromNow(date: string | Date | null) {
  if (!date) {
    return "";
  }
  const target = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  const seconds = differenceInSeconds(now, target);

  // < 1 phút
  if (seconds < 60) return "Vừa xong";

  const minutes = differenceInMinutes(now, target);

  if (minutes < 60) return `${minutes} phút trước`;

  const hours = differenceInHours(now, target);

  if (hours < 24) return `${hours} giờ trước`;

  const days = differenceInDays(now, target);

  if (days < 7) return `${days} ngày trước`;

  return formatDistanceToNow(target, {
    addSuffix: true, // thêm "trước"
    locale: vi,
  });
}
export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;

  return format(d, "dd/MM/yyyy", { locale: vi });
}
