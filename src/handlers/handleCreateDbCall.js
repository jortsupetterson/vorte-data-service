import inserNewUUIDwithEmailAlias from './SQL/insertNewUUIDwithEmailAlias.js';
import createProfileTableForNewUserDatabase from './SQL/createProfileTableForNewUserDatabase.js';
import insertProfileForNewUserDatabase from './SQL/insertProfileForNewUserDatabase.js';
import deriveUserIdAlias from './utilities/deriveAlias.js';

async function getDbNameFromUserId(env, user_email) {
	const alias = await deriveUserIdAlias('email', user_email, await env.ALIAS_SECRET.get());
	let user_id, res;
	user_id = `user:${crypto.randomUUID()}`;
	res = await env.AUTHN_D1.prepare(inserNewUUIDwithEmailAlias).bind(user_id, alias, 'email').run();
	if (res.meta.changes === 0) return null;

	await env.AUTHN_KV.put(user_id, true);
	return user_id;
}

export async function handleCreateDbCall(url, env, ctx, form, cookies, lang) {
	const [apiKey, user_id] = await Promise.all([env.D1_API_KEY.get(), getDbNameFromUserId(env, form.email)]);

	if (!user_id)
		return JSON.stringify({
			status: 409,
		});

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
				JSON.stringify(['welcome', 'passkey', 'interface', 'first-business-plan']),
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
	n;

	ctx.waitUntil(env.PROFILES_KV.put(user_id, createProfileTableResponse.result, { expirationTtl: 2_592_000 }));

	return JSON.stringify({
		status: 201,
		headers: {},
		body: user_id,
	});
}
