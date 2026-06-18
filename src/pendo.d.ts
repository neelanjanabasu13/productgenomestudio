interface PendoAgent {
  track(event: string, properties?: Record<string, unknown>): void;
}

declare var pendo: PendoAgent | undefined;
