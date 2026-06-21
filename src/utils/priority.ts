export type PriorityStyle = {
  label: string
  container: string
  dot: string
  border: string
}

export const priorityOptions = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const PRIORITY_CONFIG: Record<string, PriorityStyle> = {
  high: {
    label: 'High',
    container: 'bg-priority-high/10 text-priority-high',
    dot: 'bg-priority-high',
    border: 'border-l-priority-high',
  },
  medium: {
    label: 'Medium',
    container: 'bg-priority-medium/10 text-priority-medium',
    dot: 'bg-priority-medium',
    border: 'border-l-priority-medium',
  },
  low: {
    label: 'Low',
    container: 'bg-priority-low/10 text-priority-low',
    dot: 'bg-priority-low',
    border: 'border-l-priority-low',
  },
}

export const PRIORITY_FALLBACK: PriorityStyle = {
  label: '—',
  container: 'bg-sunken text-text-muted',
  dot: 'bg-text-muted',
  border: 'border-l-border',
}

export function getPriorityConfig(priority: string | null) {
  return PRIORITY_CONFIG[priority?.toLowerCase() ?? ''] ?? PRIORITY_FALLBACK
}
