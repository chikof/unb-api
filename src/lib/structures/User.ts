export interface UserAPIResponse {
	/**
	 * Leaderboard rank of the user
	 * @type {?number}
	 */
	rank: number;

	/**
	 * User ID of the discord user.
	 * @type {string}
	 */
	user_id: string;

	/**
	 * User's cash balance.
	 * @type {number}
	 */
	cash: number;

	/**
	 * User's bank balance.
	 * @type {number}
	 */
	bank: number;

	/**
	 * User's total balance.
	 * @type {number}
	 */
	total: number;
}

/**
 * UnbelievaBoat User Balance
 */
export class User implements UserAPIResponse {
	public rank!: number;

	public user_id!: string;

	public cash!: number;

	public bank!: number;

	public total!: number;

	/**
	 * Raw data response
	 */
	public rawData!: { value: UserAPIResponse };

	public constructor(data: UserAPIResponse) {
		Object.assign(this, { ...data, rawData: { value: data } });
	}

	public get id() {
		return this.user_id;
	}
}
