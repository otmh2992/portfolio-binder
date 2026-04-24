# Quick Check: Do portfolios have user_id values?

Go to Supabase → Table Editor → portfolios table

Look for the `user_id` column - it should have UUIDs like:
- 9fddd21d-6663-4dfe-b210-1f528db9e94d (filmmaker1)
- f90b2df8-7a93-4966-b059-c876b24f1ecd (filmmaker2)
- dcaf757a-3c94-461e-8974-8841e3d21e85 (filmmaker3)

If all portfolios show NULL or empty user_id, you need to run the migration!
