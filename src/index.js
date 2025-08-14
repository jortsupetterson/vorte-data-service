import { WorkerEntrypoint } from 'cloudflare:workers';
import { handleCreateDbCall } from './handlers/handleCreateDbCall.js';
import { getDatabaseUuidFromName } from './handlers/utilities/getDatabaseUuidFromName.js';
import { handleGetDashboardContentCall } from './handlers/handleGetDashboardContentCall.js';
import { handleGetInterfaceSettingsContentCall } from './handlers/handlGetInterfaceSettingsContentCall.js';
import { handleGetIUserSettingsContentCall } from './handlers/handleGetUserSettingsContentCall.js';

const API_BASE = 'https://api.cloudflare.com/client/v4/accounts/e8ef5da3c57b544081f2e4181d6cecc9/d1/database';

const readHandlerMap = {
	dashboard: handleGetDashboardContentCall,
	user: handleGetIUserSettingsContentCall,
	interface: handleGetInterfaceSettingsContentCall,
};

export class VorteDataService extends WorkerEntrypoint {
	//CRUD
	async createData() {}

	async readData(authorizationCookie, lang, target) {
		const [verifiedBearer, handler, apiKey] = await Promise.all([
			this.env.AUTHN_SERVICE.verifyBearer(authorizationCookie),
			readHandlerMap[target],
			this.env.D1_API_KEY.get(),
		]);
		if (!verifiedBearer) {
			return {
				status: 401,
				headers: {},
				body: null,
			};
		}
		return await handler(this.env, this.ctx, apiKey, lang, await getDatabaseUuidFromName(verifiedBearer, this.ctx, apiKey));
	}

	async updateData() {}

	async deleteData() {}

	//Others

	async createDb(form, cookies, lang) {
		return await handleCreateDbCall(API_BASE, this.env, this.ctx, form, cookies, lang);
	}
}

export default {
	async fetch(request, env, ctx) {
		const cached = await caches.default.match(request);
		if (cached) return cached;

		const response = new Response(null, {
			status: 404,
			headers: {
				'Cache-Control': 'public, max-age=31536000, immutable',
			},
		});

		ctx.waitUntil(caches.default.put(request, response.clone()));

		return response;
	},
};
