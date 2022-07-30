import { fetch, FetchMethods, FetchResultTypes } from '@sapphire/fetch';
import { RateLimit, RateLimitManager } from '@sapphire/ratelimits';
import type { UnbCLient } from '../Client';

export class RequestHandler {
	private readonly ratelimits = new RateLimitManager(1000);

	public constructor(private readonly client: UnbCLient) {}

	public async request(method: FetchMethods, endpoint: string, body = {}, attempts = 0) {
		const ratelimit = this.ratelimits.acquire(`${method}/${endpoint}`);
		const { baseURL, version } = this.client.options;
		const request = await fetch(
			`${baseURL}/${version}/${endpoint}`,
			{
				method,
				headers: {
					Authorization: this.client.token
				},
				body: JSON.stringify(body)
			},
			FetchResultTypes.Result
		);

		attempts++;
		this.parseRateLimitHeaders(request.headers, ratelimit);

		const retryRequest = () => {
			const retryAfter = request.headers.get('retry-after');
			if (retryAfter) {
				setTimeout(async () => this.request(method, endpoint, body, attempts), Number(retryAfter));
			} else {
				void this.request(method, endpoint, body, attempts);
			}
		};

		const { status } = request;

		if (status >= 200 && status < 300) {
			return request.json();
		} else if (status === 429) {
			if (attempts >= this.client.options.maxRetries) {
				throw new Error('Too many retries');
			} else {
				retryRequest();
			}
		}

		ratelimit.consume();
	}

	private parseRateLimitHeaders(headers: Headers, ratelimit: RateLimit<string>) {
		const now = Date.now();

		const ratelimitRemaining = headers.get('X-RateLimit-Remaining');
		if (ratelimitRemaining) {
			ratelimit!.remaining += Number(ratelimitRemaining) || 0;
		} else {
			ratelimit!.remaining = 1;
		}

		const retryAfter = headers.get('retry-after');
		const ratelimitReset = headers.get('X-RateLimit-Reset');
		if (retryAfter) {
			ratelimit!.expires = (Number(retryAfter) || 1) + now;
		} else if (ratelimitReset) {
			ratelimit!.expires = Math.max(Number(ratelimitReset), now);
		} else {
			ratelimit!.expires = now;
		}
	}
}
