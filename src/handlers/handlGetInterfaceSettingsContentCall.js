export async function handleGetInterfaceSettingsContentCall(env, ctx, apiKey, lang, url) {
	const getProfileRequest = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			sql: `SELECT themes_obj FROM profile`,
		}),
	});

	const getProfileResponse = await getProfileRequest.json();

	if (!getProfileResponse.success) {
		const err = new Response('D1 profile table read failed (SELECT widgets_list): ' + JSON.stringify(getProfileResponse), {
			status: 200,
			headers: { 'Content-Type': 'text/plain; charset=utf-8' },
		});
		return err;
	}
	const data = getProfileResponse.result[0].results[0];
	const themes = JSON.parse(data.themes_obj);

	const html = `
			<section class="column">
				<h4>
					${
						{
							fi: 'Teema',
							sv: 'Tema',
							en: 'Theme',
						}[lang]
					}
				</h4>
				<div class="sub-section row">
				<button
				id="dark-theme"
				title="${
					{
						fi: 'Ota tumma teema käyttöön',
						sv: 'Aktivera mörk tema',
						en: 'Activate dark theme',
					}[lang]
				}"
				>
					${
						{
							fi: 'tumma',
							sv: 'mörk',
							en: 'dark',
						}[lang]
					}
				</button>
				<button
				id="light-theme"
				title="${
					{
						fi: 'Ota vaalea teema käyttöön',
						sv: 'Aktivera ljus tema',
						en: 'Activate light theme',
					}[lang]
				}"
				>
					${
						{
							fi: 'vaalea',
							sv: 'ljus',
							en: 'light',
						}[lang]
					}
				</button>
				</div>
			</section>
			<section class="column">
				<h4>
					${
						{
							fi: 'Kontrasti',
							sv: 'Kontrast',
							en: 'Contrast',
						}[lang]
					}
				</h4>
				<div class="sub-section row">
				<button
				id="low-contrast"
				title="${
					{
						fi: 'Ota matala kontrasti käyttöön',
						sv: 'Aktivera låg kontrast',
						en: 'Activate low contrast',
					}[lang]
				}"
				>
					${
						{
							fi: 'matala',
							sv: 'låg',
							en: 'low',
						}[lang]
					}
				</button>
				<button
				id="normal-contrast"
				title="${
					{
						fi: 'Ota normaali kontrasti käyttöön',
						sv: 'Aktivera normal kontrast',
						en: 'Activate normal contrast',
					}[lang]
				}"
				>
					${
						{
							fi: 'normaali',
							sv: 'normal',
							en: 'normal',
						}[lang]
					}
				</button>
				<button
				id="high-contrast"
				title="${
					{
						fi: 'Ota korkea kontrasti käyttöön',
						sv: 'Aktivera hög kontrast',
						en: 'Activate high contrast',
					}[lang]
				}"
				>
					${
						{
							fi: 'korkea',
							sv: 'hög',
							en: 'high',
						}[lang]
					}
				</button>
				</div>
			</section>
						<section class="column">
				<h4>
					${
						{
							fi: 'Korostus',
							sv: 'Accent',
							en: 'Accent',
						}[lang]
					}
				</h4>
				<div class="sub-section row">
					<input title="${
						{
							fi: 'Muuta väriä',
							sv: 'Ändra färg',
							en: 'Change color',
						}[lang]
					}" 
					type="color" 
					value="${themes.colors.c1 || '#0B4F60'}" 
					id="c1" 
					/>
					<input 
					title="${
						{
							fi: 'Muuta väriä',
							sv: 'Ändra färg',
							en: 'Change color',
						}[lang]
					}"
					type="color"
					value="${themes.colors.c2 || '#199473'}" 
					id="c2" />
					<input 
					title="${
						{
							fi: 'Muuta väriä',
							sv: 'Ändra färg',
							en: 'Change color',
						}[lang]
					}"
					type="color" 
					value="${themes.colors.c3 || '#C75858'}" 
					id="c3" 
					class="ghost" />
					<input
					title="${
						{
							fi: 'Muuta väriä',
							sv: 'Ändra färg',
							en: 'Change color',
						}[lang]
					}"
					type="color" 
					value="${themes.colors.c4 || '#196129'}" 
					id="c4" 
					class="ghost" />
				</div>
			</section>
			<section class="column">
  				<h4>
    				${
							{
								fi: 'Kieli',
								sv: 'Språk',
								en: 'Language',
							}[lang]
						}
  				</h4>
 				 <div class="sub-section row">
  					<button
      				id="fi-language"
     				title="${
							{
								fi: 'Ota Suomen kieli käyttöön',
								sv: 'Byt till finska språket',
								en: 'Switch to Finnish language',
							}[lang]
						}"
    >
      FI
    </button>
    <button
      id="sv-language"
      title="${
				{
					fi: 'Vaihda Ruotsin kieleen',
					sv: 'Byt till svenska språket',
					en: 'Switch to Swedish language',
				}[lang]
			}"
    >
      SV
    </button>
    <button
      id="en-language"
      title="${
				{
					fi: 'Vaihda Englannin kieleen',
					sv: 'Byt till engelska språket',
					en: 'Switch to English language',
				}[lang]
			}"
    >
      EN
    </button>
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
