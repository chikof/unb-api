export * from './lib/Client';
export * from './lib/types/User';
export * from './lib/structures/User';

/**
 * The [@chikoshidori/unb-api](https://github.com/chikoshidori/unb-api) version that you are currently using.
 *
 * Note to unb-api developers: This needs to explicitly be `string` so it is not typed as the string that gets replaced by Rollup
 */
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const version: string = '[VI]{version}[/VI]';
