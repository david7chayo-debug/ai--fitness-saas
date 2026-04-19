import { useStorage } from './useStorage'

const DEFAULT_SPORTS_EVENTS = []

export function useSportsEvents() {
  return useStorage('yosi_sports_events', DEFAULT_SPORTS_EVENTS)
}