# Custom domain checklist

The canonical public URL is **https://statuspass.com**. Set `NEXT_PUBLIC_SITE_URL=https://statuspass.com` on Vercel Production. Preview deployments keep the `*.vercel.app` host as fallback.

Leave `*.vercel.app` as the only public URL only until the records below resolve and TLS is issued.

## 1. Pick a domain you control

Use a domain already registered to the founder or the StatusPass operator. Do not guess a brand domain in git, Vercel, or Search Console.

## 2. Attach it in Vercel

1. Open the StatusPass project → **Settings → Domains**.
2. Add the exact hostname you own (apex, `www`, or both).
3. Copy the **A / AAAA / CNAME** values Vercel shows for *that* hostname. They change by project — do not reuse values from another app.

## 3. Publish DNS at the registrar

1. At the registrar (or DNS host) for the domain you own, add only the records Vercel displayed.
2. Wait for DNS to propagate. Do not point the domain at a guessed IP.
3. In Vercel, wait until the domain shows a valid certificate.

## 4. Point the app at the public origin

Set these on the Vercel project (Production):

```
NEXT_PUBLIC_SITE_URL=https://statuspass.com
```

No trailing slash. Sitemap, Open Graph, and auth redirect URLs read this value. After it is set, redeploy.

If you use Supabase Auth, add the same origin to **Authentication → URL configuration** (`Site URL` and redirect allow-list).

## 5. Confirm the public site

- Landing loads over HTTPS on the attached domain.
- Footer still shows **Founded by DINESH S** and the legal disclaimer.
- No Vercel “Powered by” / sponsored badge is visible.
- `/signup` still shows the disclaimer beside the form.
- `/app/sevis`, `/app/cases`, and `/app/h1b` remain usable.

## 6. Search Console (after the domain is live)

1. Add the attached origin as a property.
2. Request indexing for `/`, `/signup`, `/login`, `/terms`, `/privacy`.
3. Do not submit `/app/*` — those routes are `noindex`.

## Temporary URL

`https://temporary-prompt-pavo-7vphl3a.vercel.app` is a tone reference only. Replace it with the attached custom domain once the checklist above is green.
