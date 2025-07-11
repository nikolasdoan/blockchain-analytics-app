import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToChart(chartId: string) {
  const chartElement = document.querySelector(`[data-chart-id="${chartId}"]`);
  if (chartElement) {
    const container = document.querySelector('.charts-scroll-container');
    if (container) {
      container.scrollTo({
        left: chartElement.getBoundingClientRect().left - container.getBoundingClientRect().left + container.scrollLeft - 16, // 16px for padding
        behavior: 'smooth'
      });
    }
  }
}
