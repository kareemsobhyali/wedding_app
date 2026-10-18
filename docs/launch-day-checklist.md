# Launch Day Checklist

## 1. Before Opening
- [ ] Database is healthy and PITR is confirmed active.
- [ ] R2 Bucket exists, CORS is applied, and policy is Private.
- [ ] Vercel (`wedding.com`) is pointing correctly to the domain.
- [ ] Render API (`api.wedding.com`) is correctly resolving and returning `200 OK` on `/api/v1/health` (if implemented).
- [ ] Initial Admin provisioned using `npm run provision-admin`.
- [ ] SSL certificates verified via browser padlock icon.
- [ ] `docs/production-smoke-test.md` completed flawlessly.

## 2. Opening
- [ ] Remove any temporary "Coming Soon" Vercel edge protections or HTTP Basic Auth blocks.
- [ ] Announce availability.
- [ ] Verify the first real active invitation resolves securely without exposing draft properties.

## 3. After Opening
- [ ] Monitor Render logs for the first hour. Keep an eye out for unexpected `500 Internal Server Error`.
- [ ] Verify R2 metrics to ensure uploads are successfully arriving.
- [ ] Verify Admin Analytics dashboard begins tracking `VIEW` events naturally from public traffic.
