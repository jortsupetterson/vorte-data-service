export default {
	welcome: async (lang, firstname, lastname) => {
		return `
            	<div class="widget column ghost">
					<p><strong>${{ fi: 'Tervetuloa Vorteen', sv: 'Välkommen till Vorte', en: 'Welcome to Vorte' }[lang]}!</strong><br><br>
						${
							{
								fi: 'Kiitos kun valitsit meidät',
								sv: 'Tack för att du valde oss',
								en: 'Thank you for choosing us',
							}[lang]
						} ${firstname} ${lastname}!
					</p>
					<div class="row">
	                    <button class="action">${{ fi: 'selvä', sv: 'uppfattat', en: 'got it' }[lang]}</button>
					</div>
				</div>
        `;
	},
	passkey: async (lang) => {
		return `
            	<div class="widget column ghost">
                    <p>
                        ${
													{
														fi: `Lisää laitekohtainen pääsyavain parantaaksesi tunnistautumisen turvallisuutta`,
														sv: `Lägg till en enhetsspecifik åtkomstnyckel för att öka säkerheten vid autentisering`,
														en: `Add a device-specific access key to enhance authentication security`,
													}[lang]
												}
                    </p>
					<div class="row">
                        <button class="action">${{ fi: 'avaa asetukset', sv: 'öppna inställningar', en: 'open settings' }[lang]}</button>
					</div>
			    </div>
        `;
	},
	interface: async (lang) => {
		return `
				<div class="widget column ghost">
					<p>
                        ${
													{
														fi: `Mukauta käyttöliittymä sinulle sopivaksi asetuksissa`,
														sv: `Anpassa gränssnittet efter dina behov i inställningarna`,
														en: `Customize the interface to your preferences in the settings`,
													}[lang]
												}   
					</p>
					<div class="row">
                        <button class="action">${{ fi: 'avaa asetukset', sv: 'öppna inställningar', en: 'open settings' }[lang]}</button>
					</div>
				</div>
        `;
	},
	first_business_plan: async (lang) => {
		return `
				<div class="widget column ghost">
                    <p>
                        ${
													{
														fi: `Aloita matkasi kohti yrittäjyyttä`,
														sv: `Börja din resa mot entreprenörskap`,
														en: `Start your journey towards entrepreneurship`,
													}[lang]
												} <strong>${
			{
				fi: `Polku yrittäjäksi`,
				sv: `Vägen till företagande`,
				en: `Road to Entrepreneurship`,
			}[lang]
		}</strong> ${
			{
				fi: `sovelluksella`,
				sv: `med applikationen`,
				en: `application`,
			}[lang]
		}
                    </p>
					<div class="row">
                        <button class="action">${{ fi: 'avaa sovellus', sv: 'öppna appen', en: 'open app' }[lang]}</button>
					</div>
				</div>
        `;
	},
};
