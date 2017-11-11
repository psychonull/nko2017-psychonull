# entities

- User
    email
    state (pend, active, deleted)
    nombre

- Event
    creator
    to (email list?)
    title
    description (MD)
    date
    repeat
    max_attendance

- User-Event
    uid
    eid
    token
    state
    name?

#  routes
    / 
        main form
    /ev/:eid
        event page
    /ev/:eid?token=:eut
        event page - user specific

#  Flow
    Create ->
        create user -> find or create (inactive by default)
        create event -> 
    email creator ->
        confirm via magic link or reply