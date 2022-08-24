export interface EditUserBalanceData {
	/**
	 *  The amount to increase/decrease the user's cash balance by.
	 * @type {number}
	 */
	cash?: number | string;

	/**
	 * The amount to increase/decrease the user's bank balance by.
	 * @type {number}
	 */
	bank?: number | string;

	/**
	 * The reason for changing the users balance to show in the audit log.
	 * @type {string}
	 * @default '@chikoshidori/unb-api did this.'
	 */
	reason?: string;
}

export interface SetUserBalanceData {
	/**
	 * The amount of cash to set the user's balance to.
	 * @type {number}
	 */
	cash?: number | string;

	/**
	 * The amount of bank to set the user's balance to.
	 * @type {number}
	 */
	bank?: number | string;

	/**
	 * The reason for changing the users balance to show in the audit log.
	 * @type {string}
	 * @default '@chikoshidori/unb-api did this.'
	 */
	reason?: string;
}
