export default `
INSERT INTO identifiers (user_id, alias, method)
	SELECT ?1, ?2, ?3
		WHERE NOT EXISTS (SELECT 1 FROM identifiers WHERE alias = ?2)
			AND NOT EXISTS (SELECT 1 FROM identifiers WHERE user_id = ?1);
		`;
