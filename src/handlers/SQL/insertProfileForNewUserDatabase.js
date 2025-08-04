export default `
INSERT INTO profile (user_id, firstname, lastname, email_address, widgets_list, themes_obj, created_by, edited_by)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
`;
