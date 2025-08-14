// ESM
import fs from 'node:fs/promises';

/* ---------- HTML ---------- */
function minifyHTML(s) {
  return s
    .replace(/>\s+</g, '><')      // poista väli tagien välistä
    .replace(/\s+/g, ' ')         // kaikki whitespace -> yksi välilyönti
    .trim();
}
function looksHTML(s) {
  // vältä SQL:ää; tagin avaus riittää signaaliksi
  return /<\w[\s\S]*?>/m.test(s);
}

/* ---------- SQLite (D1) ---------- */
function minifySQLite(sql) {
  let out = '', i = 0, n = sql.length;
  let mode = 'code'; // code|squote|dquote|bquote|bracket|blockcomment|linecomment
  let needSpace = false;
  const isWord = c => /[A-Za-z0-9_\u00C0-\u024F]/.test(c);
  const pushSpace = () => { if (needSpace) { out += ' '; needSpace = false; } };

  while (i < n) {
    const c = sql[i], c2 = sql[i+1];

    if (mode === 'linecomment') { if (c === '\n' || c === '\r') mode='code'; i++; continue; }
    if (mode === 'blockcomment'){ if (c === '*' && c2 === '/') { i+=2; mode='code'; } else i++; continue; }
    if (mode === 'squote')      { out+=c; i++; if (c==="'" && sql[i]==="'"){ out+=sql[i++]; } else if (c==="'"){ mode='code'; } continue; }
    if (mode === 'dquote')      { out+=c; i++; if (c==='"' && sql[i]==='"'){ out+=sql[i++]; } else if (c==='"'){ mode='code'; } continue; }
    if (mode === 'bquote')      { out+=c; i++; if (c==='`' && sql[i]==='`'){ out+=sql[i++]; } else if (c==='`'){ mode='code'; } continue; }
    if (mode === 'bracket')     { out+=c; i++; if (c===']'){ mode='code'; } continue; }

    if (c==='-' && c2==='-') { i+=2; mode='linecomment'; continue; }
    if (c==='/' && c2==='*') { i+=2; mode='blockcomment'; continue; }

    if (c==="'" || c==='"' || c==='`' || c==='[') {
      pushSpace(); out+=c; i++;
      mode = c==="'"?'squote':c==='"'?'dquote':c==='`'?'bquote':'bracket';
      continue;
    }

    if (c <= ' ') {
      const prev = out[out.length-1] || '';
      let j = i+1; while (j<n && sql[j] <= ' ') j++;
      const next = sql[j] || '';
      if (isWord(prev) && isWord(next)) needSpace = true;
      i = j; continue;
    }

    pushSpace();
    out += c; i++;
  }
  return out.trim();
}
function looksSQL(s) {
  if (!s || s.length < 8) return false;
  // Älä käsittele ilmiselvää HTML:ää
  if (/<[a-zA-Z]/.test(s)) return false;
  return /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WITH|BEGIN|COMMIT|PRAGMA)\b/i.test(s);
}

/* ---------- Plugin ---------- */
export default function contentMinifierPlugin({ tag = 'sql' } = {}) {
  const tagTpl = new RegExp(String.raw`${tag}\s*` + '`([\\s\\S]*?)`', 'g');
  const anyTpl = /`([\s\S]*?)`/g;

  return {
    name: 'content-minifier',
    setup(build) {
      // .html → minifioitu tekstinä
      build.onLoad({ filter: /\.html$/ }, async (args) => {
        const src = await fs.readFile(args.path, 'utf8');
        return { contents: minifyHTML(src), loader: 'text' };
      });

      // .js/.ts → käsittele kaikki backtick-templaatit yhdessä passissa
      build.onLoad({ filter: /\.[cm]?[jt]s$/ }, async (args) => {
        let src = await fs.readFile(args.path, 'utf8');

        // 1) Tagatut SQL-templaatit: sql`...`
        src = src.replace(tagTpl, (_m, body) => `${tag}\`${minifySQLite(body)}\``);

        // 2) Kaikki muut templaatit: päättele HTML vs SQL
        src = src.replace(anyTpl, (_m, body) => {
          if (looksHTML(body))  return '`' + minifyHTML(body)  + '`';
          if (looksSQL(body))   return '`' + minifySQLite(body) + '`';
          return _m; // ei kosketa
        });

        return { contents: src, loader: 'default' };
      });
    },
  };
}
