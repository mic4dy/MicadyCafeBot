export type EventModule = {
  name: string;
  once: boolean;
  execute: (...args: any[]) => Promise<void>;
};
