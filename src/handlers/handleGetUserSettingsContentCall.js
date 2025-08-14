export async function handleGetIUserSettingsContentCall(env, ctx, apiKey, lang, url) {
	const getProfileRequest = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			sql: `
            SELECT firstname, lastname, email_address FROM profile;
            `,
		}),
	});

	//            SELECT platform, name, created_at FROM devices

	const getProfileResponse = await getProfileRequest.json();

	if (!getProfileResponse.success) {
		const err = new Response('D1 profile table read failed (SELECT widgets_list): ' + JSON.stringify(getProfileResponse), {
			status: 200,
			headers: { 'Content-Type': 'text/plain; charset=utf-8' },
		});
		return err;
	}
	const data = getProfileResponse.result[0].results[0];

	const html = `
<section class="column">
	<h4>${{ fi: 'Omat tiedot', sv: 'Mina uppgifter', en: 'My information' }[lang]}</h4>

    <div class="column ghost">
	<div class="column transparent">
		<label for="firstname">${{ fi: 'Etunimi:', sv: 'Förnamn:', en: 'Firstname:' }[lang]}</label>
		<input
			id="firstname"
			type="text"
			name="firstname"
			required
			aria-required="true"
			autocomplete="given-name"
			pattern="^[A-Z\u00C0-\u00D6\u00D8-\u00DE][a-z\u00E0-\u00F6\u00F8-\u00FF]+(?:[\u0020\u002D'][A-Z\u00C0-\u00D6\u00D8-\u00DE][a-z\u00E0-\u00F6\u00F8-\u00FF]+):$"
			value="${data.firstname}"
			title="${
				{
					fi: 'Anna kunnollinen etunimi',
					sv: 'Ange ett giltigt förnamn',
					en: 'Enter a valid first name',
				}[lang]
			}"
		/>
		<output id="firstname-feedback" for="firstname"></output>
	</div>

	<div class="column transparent">
		<label for="lastname">${{ fi: 'Sukunimi:', sv: 'Efternamn:', en: 'Lastname:' }[lang]}</label>
		<input
			id="lastname"
			type="text"
			name="lastname"
			required
			aria-required="true"
			autocomplete="family-name"
			pattern="^[A-Z\u00C0-\u00D6\u00D8-\u00DE][a-z\u00E0-\u00F6\u00F8-\u00FF]+(?:[\u0020\u002D'][A-Z\u00C0-\u00D6\u00D8-\u00DE][a-z\u00E0-\u00F6\u00F8-\u00FF]+):$"
			value="${data.lastname}"
			title="${
				{
					fi: 'Anna kunnollinen sukunimi',
					sv: 'Ange ett giltigt efternamn',
					en: 'Enter a valid last name',
				}[lang]
			}"
		/>
		<output id="lastname-feedback" for="lastname"></output>
	</div>
	<div class="column transparent">
		<label for="email">${{ fi: 'Sähköposti:', sv: 'E-post:', en: 'Email:' }[lang]}</label>
		<input
			id="email"
			type="email"
			name="email"
			required
			aria-required="true"
			autocomplete="email"
			pattern="^[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}$"
			value="${data.email_address}"
			title="${
				{
					fi: 'Anna kelvollinen sähköpostiosoite, esim. botti.example@mail.com',
					sv: 'Ange en giltig e-postadress, t.ex. bot.example@mail.com',
					en: 'Enter a valid email address, e.g. bot.example@mail.com',
				}[lang]
			}"
		/>
		<output id="email-feedback" for="email"></output>
	</div>

	<div class="column transparent">
		<label for="newsletter">
			${{ fi: 'Vastaanota uutiskirje Vortelta:', sv: 'Prenumerera på Vortes nyhetsbrev:', en: 'Receive the newsletter from Vorte:' }[lang]}
		</label>
		<div id="newsletter" class="row transparent">
			<button
				id="subscribe"
				title="${
					{
						fi: 'Tilaa uutiskirje',
						sv: 'Prenumerera på nyhetsbrevet',
						en: 'Subscribe to the newsletter',
					}[lang]
				}"
			>
				${{ fi: 'kyllä', sv: 'ja', en: 'yes' }[lang]}
			</button>
			<button
				id="unsubscribe"
				title="${
					{
						fi: 'Peruuta uutiskirjeen tilaus',
						sv: 'Avsluta prenumerationen',
						en: 'Unsubscribe from the newsletter',
					}[lang]
				}"
			>
				${{ fi: 'ei', sv: 'nej', en: 'no' }[lang]}
			</button>
		</div>
	</div>
    </div>
</section>

<section class="column">
	<h4>${{ fi: 'Laitteet ja pääsyavaimet', sv: 'Enheter och passnycklar', en: 'Devices and passkeys' }[lang]}</h4>
        <div class="column ghost">
        </div>
</section>

        `;

	const resp = {
		status: 200,
		headers: { 'Content-Type': 'text/html; charset=utf-8' },
		body: html,
	};

	return resp;
}
