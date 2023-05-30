# GymPass-Style-App

## Functional Requirements
- It must be possible to register
- Must be able to authenticate
- It should be possible to get a profile of a logged in user
- It must be possible to obtain the number of check-ins performed by the logged-in user
- It must be possible for the user to obtain his check-in history
- It should be possible for the user to search for nearby gyms
- It should be possible for the user to search for gyms by name
- It must be possible for the user to check-in at a gym
- It must be possible to validate a user's check-in
- It must be possible to register a gym

## Business Rules
- User should not be able to register with a duplicate email
- The user must not be able to do two check-ins on the same day
- The user cannot check-in if he is not close (100m) to the gym
- Check-in can only be validated after 20 minutes after creation
- Check-in can only be validated by administrators
- The academy can only be registered by administrators

## Non-Functional Requirements
- User password must be encrypted
- Application data must be persisted in a PostgreSQL database
- All item lists must be paginated with 20 items per page
- The user must be identified by a JWT (JSON Web Token)
