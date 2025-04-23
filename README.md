Repo to demonstrate bug in Vercel where the first deployment on a preview branch does not get the value of a env value set during the build

The code is a bare-bones Vercel project.
The build executes `tsx upserEnv.tsx` which sets a value for a branch specific ENV value.
On the first deploy of a preview branch, the value will not be set. On second and subseqent deployments, the value will be set.
