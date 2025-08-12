import { WorkerEntrypoint } from 'cloudflare:workers';
import { handleCreateDbCall } from './handlers/handleCreateDbCall.js';
import { handleGetDashboardContentCall } from './handlers/handleGetDashboardContentCall.js';
const API_BASE = 'https://api.cloudflare.com/client/v4/accounts/e8ef5da3c57b544081f2e4181d6cecc9/d1/database';

export class VorteDataService extends WorkerEntrypoint {
	//CRUD
	async createData() {}

	async readData() {}

	async updateData() {}

	async deleteData() {}

	//Others
	async getDashboardContent(authorization, lang) {
		return await handleGetDashboardContentCall(this.env, this.ctx, authorization, lang);
	}

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
