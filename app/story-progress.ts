export const TRANSITION_START = .22;
export const clamp = (n: number) => Math.min(1, Math.max(0, n));
export const smooth = (n: number) => n * n * (3 - 2 * n);
export const transitionAt = (progress: number) => smooth(clamp((progress - Math.floor(progress) - TRANSITION_START) / (.94 - TRANSITION_START)));
