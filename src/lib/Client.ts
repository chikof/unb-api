import { FetchMethods } from '@sapphire/fetch';
import { RequestHandler } from './structures/RequestHandler';
import { User, type UserAPIResponse } from './structures/User';
import type { EditUserBalanceData, SetUserBalanceData } from './types/User';

export interface UnbClientOptions {
	/**
	 * The api hostname to use. Defaults to https://unbelievaboat.com/api.
	 * @default https://unbelievaboat.com/api
	 * @type {string}
	 */
	baseURL: string;

	/**
	 * The api version to use. Defaults to the latest version.
	 * @default 'v1'
	 * @type {string}
	 */
	version: `v${number}`;

	/**
	 * The maximum number of times to retry a request if it's ratelimited. Defaults to 3.
	 * @default 3
	 * @type {number}
	 */
	maxRetries: number;
}

const reason = '@chikoshidori/unb-api did this.';

/**
 * The client for the Unbelievable Boat API.
 */
export class UnbCLient {
	private readonly requestHandler = new RequestHandler(this);

	public constructor(
		/**
		 * - Your api token. You may get one [here](https://unbelievaboat.com/api/docs).
		 * @type {String}
		 */
		public readonly token: string,

		/**
		 * - The options for the api client.
		 */
		public readonly options: UnbClientOptions = {
			baseURL: 'https://unbelievaboat.com/api',
			version: 'v1',
			maxRetries: 3
		}
	) {
		if (!token || typeof token !== 'string') throw new TypeError('The API token must be a string');
	}

	/**
	 * Get a users balance.
	 *
	 * @param {string} guildId - The guild id to get from.
	 * @param {string} userId - The user id to get.
	 * @example
	 * <Client>.getUserBalance('446335359664783370', '462780441594822687');
	 *
	 * @see {@link https://unbelievaboat.com/api/docs#get-user-balance|Get User Balance}
	 */
	public async getUserBalance(guildId: string, userId: string): Promise<User> {
		const response = await this._request<UserAPIResponse>(FetchMethods.Get, `guilds/${guildId}/users/${userId}`);

		return new User(response);
	}

	/**
	 * Increase or decrease a user's balance by the cash and bank values given.
	 * Use negative values to decrease.
	 *
	 * @param {string} guildId - The guild id to use.
	 * @param {string} userId - The user id to modify the balance of.
	 * @example
	 * <Client>.editUserBalance('446335359664783370', '462780441594822687', {
	 *    reason: '@chikoshidori/unb-api did this.',
	 *    cash: '-100'
	 * });
	 *
	 * @see {@link https://unbelievaboat.com/api/docs#patch-user-balance|Patch User Balance}
	 */
	public async editUserBalance(guildId: string, userId: string, data: EditUserBalanceData = { reason }): Promise<User> {
		const response = await this._request<UserAPIResponse>(FetchMethods.Patch, `guilds/${guildId}/users/${userId}`, data);

		return new User(response);
	}

	/**
	 * Set a users balance to the provided values.
	 *
	 * @param {string} guildId - The guild id to use.
	 * @param {string} userId - The user id to set the balance of.
	 * @example
	 * <Client>.setUserBalance('446335359664783370', '462780441594822687', {
	 *    reason: '@chikoshidori/unb-api did this.',
	 *    cash: 100
	 * });
	 *
	 * @see {@link https://unbelievaboat.com/api/docs#put-user-balance|Put User Balance}
	 */
	public async setUserBalance(guildId: string, userId: string, data: SetUserBalanceData = { reason }): Promise<User> {
		const response = await this._request<UserAPIResponse>(FetchMethods.Put, `guilds/${guildId}/users/${userId}`, data);

		return new User(response);
	}

	private async _request<T = unknown>(method: FetchMethods, endpoint: string, body = {}): Promise<T> {
		return this.requestHandler.request(method, endpoint, body) as Promise<T>;
	}
}
