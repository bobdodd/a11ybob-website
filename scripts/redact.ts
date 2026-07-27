/* Mask credentials in connection strings before they are logged.
 *
 * These scripts print their Mongo and OpenSearch endpoints on startup, which is
 * genuinely useful — it is how you notice you are pointed at the wrong database
 * before you write to it. The problem is that the production Mongo URI carries
 * a password, so every run of `npm run index` on the VPS wrote that password to
 * the terminal, into scrollback, and into anything capturing the command's
 * output.
 *
 * The username is deliberately kept. It is not the secret, and knowing which
 * account a script connected as is exactly the kind of thing you want in a log
 * when something has gone wrong. Only the password is replaced.
 *
 * Applied to the OpenSearch URLs too, even though that service currently runs
 * with its security plugin disabled on loopback and so has no credentials in
 * its URL. If that ever changes, the masking is already in place rather than
 * being remembered at the moment it starts to matter. */

/**
 * `mongodb://user:secret@host/db` becomes `mongodb://user:***@host/db`.
 * A URI with no userinfo is returned unchanged.
 *
 * Splits the authority at its LAST `@` rather than its first. A password
 * containing an unencoded `@` should not occur in a well-formed URI, but it is
 * a common enough mistake in Mongo connection strings that a masker which
 * assumes otherwise will leak the tail of the password — which an earlier
 * version of this function did.
 */
export function redactUri(uri: string): string {
  const parsed = /^([a-z][a-z0-9+.-]*:\/\/)([^/?#]*)([\s\S]*)$/i.exec(uri);
  if (!parsed) return uri;
  const [, scheme, authority, rest] = parsed;

  const at = authority.lastIndexOf("@");
  if (at === -1) return uri;

  const userinfo = authority.slice(0, at);
  const host = authority.slice(at + 1);
  const colon = userinfo.indexOf(":");
  const masked = colon === -1 ? userinfo : `${userinfo.slice(0, colon)}:***`;
  return `${scheme}${masked}@${host}${rest}`;
}
