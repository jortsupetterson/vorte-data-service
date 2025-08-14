export default {
	welcome: async (lang, firstname, lastname) => {
		return `
            	<div id="welcome" class="widget column ghost">
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
                        <a  id="user" class="action"
						hreflang="${lang}"
						href="${
							{
								fi: '/fi/omat-asetukset/käyttäjä',
								sv: '/sv/mina-inställningar/användare',
								en: '/en/my-settings/user',
							}[lang]
						}"
						title="${
							{
								fi: 'Siirry muokkaamaan tiliisi liittyviä tietoja',
								sv: 'Gå till redigeringsinformation related till dit konto',
								en: 'Go edit information related to your account',
							}[lang]
						}"
						>
						${{ fi: 'avaa asetukset', sv: 'öppna inställningar', en: 'open settings' }[lang]}
						</a>
					</div>
			    </div>
        `;
	},
	interface: async (lang) => {
		return `
				<div id="interface" class="widget column ghost">
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
                        <a id="interface" class="action"
                        hreflang="${lang}"
                        href="${
													{
														fi: '/fi/omat-asetukset/käyttöliittymä',
														sv: '/sv/mina-inställningar/gräns-snittet',
														en: '/en/my-settings/interface',
													}[lang]
												}"
                        title="${
													{
														fi: 'Siirry muokkaamaan käyttöliittymääsi (teema, korostusvärit, kontrasti, kieli)',
														sv: 'Gå till anpassa ditt gränssnitt (tema, accentfräger, kontrast, spårk)',
														en: 'Go edit your interface (theme, accentcolors, contrast, language)',
													}[lang]
												}"
                        >
                        ${{ fi: 'avaa asetukset', sv: 'öppna inställningar', en: 'open settings' }[lang]}
                        </a>
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
                        <a id="road-to-entrepreneurship" class="action"
						hreflang="${lang}"
						href="${
							{
								fi: '/fi/polku-yrittäjäksi',
								sv: '/sv/vagen-till-foretagande',
								en: '/en/road-to-entrepreneurship',
							}[lang]
						}"
						title="${
							{
								fi: 'Avaa Polku yrittäjäksi -sovellus',
								sv: 'Öppna applikationen Vägen till företagande',
								en: 'Open the Road to Entrepreneurship application',
							}[lang]
						}"
						>
						${{ fi: 'avaa sovellus', sv: 'öppna appen', en: 'open app' }[lang]}
						</a>
					</div>
				</div>
        `;
	},
};
