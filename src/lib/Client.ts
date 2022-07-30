import { FetchMethods } from '@sapphire/fetch';
import { RequestHandler } from './structures/RequestHandler';
import { User } from './structures/User';

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

export class UnbCLient {
	private readonly requestHandler = new RequestHandler(this);

	public constructor(
		/**
		 * Your api token. You may get one [here](https://unbelievaboat.com/api/docs).
		 * @type {String}
		 */
		public readonly token: string,

		public readonly options: UnbClientOptions = {
			baseURL: 'https://unbelievaboat.com/api',
			version: 'v1',
			maxRetries: 3
		}
	) {
		if (!token || typeof token !== 'string') throw new TypeError('The API token must be a string');
	}

	/**
	 * Increase or decrease the User's balance by a value given in the params
	 * @example
	 * <Client>.editUserBalance('123456789012345678', '123456789012345678', {
		reason: '@chikoshidori/unb-api did this.',
		cash: '-100'
	});
	*/
	public async editUserBalance(guildId: string, userId: string, data: EditUserBalanceData = { reason: '@chikoshidori/unb-api did this.' }) {
		return this._request(FetchMethods.Patch, `guilds/${guildId}/users/${userId}`, data).then((data) => new User(data));
	}

	private async _request(method: FetchMethods, endpoint: string, body = {}) {
		return this.requestHandler.request(method, endpoint, body);
	}
}

export interface EditUserBalanceData {
	/**
	 * The amount of cash to add to the user's balance.
	 * @type {number}
	 */
	cash?: number | string;

	/**
	 * The amount of bank to add to the user's balance.
	 * @type {number}
	 */
	bank?: number | string;

	/**
	 * Audit log reason
	 * @type {string}
	 */
	reason?: string;
}
