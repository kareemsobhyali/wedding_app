# Post-Launch Checklist

## First Hour
- [ ] Watch Vercel Traffic logs for 404 spikes.
- [ ] Watch Render Logs for high latency (`>1000ms`) API responses.
- [ ] Confirm no orphaned R2 objects are generated heavily (meaning uploads fail to finalize in DB).

## First Day
- [ ] Review Database Connections graph (Prisma pooling should be stable, no connection leaks).
- [ ] Review Cloudflare Cache HIT/MISS ratio for public invitations.
- [ ] Perform a quick Admin Dashboard review to ensure no `PENDING_REVIEW` spam exists.

## First Week
- [ ] Verify database storage usage aligns with expectations.
- [ ] Rotate `JWT_SECRET` only if suspected compromise, otherwise leave stable.
- [ ] Ensure analytics batch ingestion is cleanly offloading to PostgreSQL without throttling constraints breaking.
