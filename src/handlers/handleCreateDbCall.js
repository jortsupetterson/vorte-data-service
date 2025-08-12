import inserNewUUIDwithEmailAlias from './SQL/insertNewUUIDwithEmailAlias.js';
import createProfileTableForNewUserDatabase from './SQL/createProfileTableForNewUserDatabase.js';
import insertProfileForNewUserDatabase from './SQL/insertProfileForNewUserDatabase.js';
import deriveUserIdAlias from './utilities/deriveAlias.js';

async function getDbNameFromUserId(env, ctx, user_email) {
	const alias = await deriveUserIdAlias('email', user_email, await env.ALIAS_SECRET.get());
	let user_id, res;
	user_id = `user:${crypto.randomUUID()}`;
	res = await env.AUTHN_D1.prepare(inserNewUUIDwithEmailAlias).bind(user_id, alias, 'email').run();
	if (res.meta.changes === 0) return null;

	ctx.waitUntil(env.AUTHN_KV.put(alias, user_id, { expirationTtl: 2_592_000 }));
	return user_id;
}

export async function handleCreateDbCall(url, env, ctx, form, cookies, lang) {
	try {
		const [apiKey, user_id] = await Promise.all([env.D1_API_KEY.get(), getDbNameFromUserId(env, ctx, form.email)]);

		// duplikaatti → ei heitetä poikkeusta, palautetaan 409
		if (!user_id) {
			return {
				status: 409,
				headers: {
					'Set-Cookie': 'AUTHN_VERIFIER=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0;',
				},
				body: null,
			};
		}

		// luo D1 database
		const createDbRequest = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: user_id,
				region: 'EASTERN_EUROPE',
			}),
		});

		const createDbResponse = await createDbRequest.json();
		if (!createDbResponse.success) {
			throw new Error('D1 database creation failed: ' + JSON.stringify(createDbResponse));
		}

		const dbId = createDbResponse.result.uuid;

		// luo profiilitaulu
		const createTableResp = await fetch(`${url}/${encodeURIComponent(dbId)}/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sql: createProfileTableForNewUserDatabase,
			}),
		});
		const createTableJson = await createTableResp.json();
		if (!createTableJson.success) {
			throw new Error('D1 profile table creation failed (create table): ' + JSON.stringify(createTableJson));
		}

		// lisää profiilirivi
		const profileInsertResponse = await fetch(`${url}/${encodeURIComponent(dbId)}/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sql: insertProfileForNewUserDatabase,
				params: [
					user_id,
					form.firstname,
					form.lastname,
					form.email,
					JSON.stringify(['welcome', 'passkey', 'interface', 'first_business_plan']),
					JSON.stringify({
						theme: cookies.theme || 'dark',
						contrast: cookies.contrast || 'normal',
						colors: {
							primary: cookies.primary || '#0b4f60',
							secondary: cookies.secondary || '#199473',
							primart_ghost: cookies.primary_ghost || 'rgba(11, 79, 96, 0.6)',
							secondary_ghost: cookies.secondary_ghost || 'rgba(25, 148, 115, 0.6)',
						},
						lang: cookies.lang || lang,
					}),
					user_id,
					user_id,
				],
			}),
		});
		const createProfileTableResponse = await profileInsertResponse.json();
		if (!createProfileTableResponse.success) {
			throw new Error('D1 profile table creation failed (insert): ' + JSON.stringify(createProfileTableResponse));
		}

		ctx.waitUntil(env.PROFILES_KV.put(user_id, JSON.stringify(createProfileTableResponse.result), { expirationTtl: 2_592_000 }));

		return {
			status: 201,
			headers: {
				'Set-Cookie': 'AUTHN_VERIFIER=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0;',
			},
			body: user_id,
		};
	} catch (err) {
		// ei heitetä poikkeusta takaisin (→ ei {"remote":true})
		const msg = err && err.message ? err.message : String(err);
		return {
			status: 400,
			headers: {
				'Set-Cookie': 'AUTHN_VERIFIER=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0;',
			},
			body: `[DATA] Error at createDb: ${msg}`,
		};
	}
}
