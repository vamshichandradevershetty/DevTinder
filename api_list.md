devtinder API's

POST
auth router
/signup
/login
/logout


POST connectionrequest routes
/request/send/interested/profileid
/request/send/ignored/profileid
/request/review/acceptrequest/requestid
/request/review/rejectrequest/requestid


GET user routers
/connections
/requestreceived
/feed - gets the profiles of other users (home page of the website)

GET
/profile/view

PATCH
/profile/edit
/profile/updatepassword


status: ignored profile,like profile, accept request, reject request