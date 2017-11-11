# API SPEC

## Security
  Authorization header - user token  
  can return 401 for invalid tokens

## Endpoints

> `POST /events` (security: none)

#### Params
  (body)

    {
      email: 'creator@creatorsHost.com',
      title: 'My shiny event',
      body: 'This is the event description',
      when: '2017-11-11T21:12:06.322Z',
      maxAttendees: 22
    }

#### Response
  OK: 204 (empty response)  
  BAD REQUEST: 400  
  ERROR: 500

#### Description
  Creates an event pending of confirmation  
  Fires a confirmation email  
  *Ideally with IP throttling / spam detection*

> `GET /events/:id` (security: optional)

### Params
  Id - Obfuscated event id (not the postgres integer)

### Response
  NOT FOUND: 404  
  OK: 200  
    
    {
      [...props]
    }
  
### description
  Gets the full event info including attendees and owner.   
  Adds a `me` property to the user when auth provided (can be attendee and/or owner).

> `POST /events/:id/attendees` (security: none)

### Params
  (body)  

    {
      name: 'FakeNickname',
      email: 'email@m.com'
    }

### Response
  OK:   
  BAD REQUEST  
  NOT FOUND  
  ERROR

### Description
  Includes validations for ended events, maxAttendees, cancelled state.  
  Fires a confirmation email.

> `DELETE /events/:id/attendees` (security: required)

### Params
  None

### Response
  OK: 204  
  NOT FOUND: 404

### Description
  Removes the attendee validated via token from the event

# Server Routes

> CONFIRM EVENT CREATION

> CONFIRM PARTICIPATION
