let _ = attr => ({
  label_email: 'Your Email',
  label_when: 'When',
  label_title: 'Title',
  label_body: 'Body',
  label_maxAttendees: 'Max',

  placeholder_name: 'Your Name',
  placeholder_email: 'Your email address',
  placeholder_body: 'Enter any info about the event (You can use markdown here)',

  hint_email: 'This address is used to confirm the event creation and let you make later changes on it. It will be hidden to others',
  hint_when: '',
  hint_title: '',
  hint_body: '',
  hint_maxAttendees: '',

  create: 'Create'
})[attr]

export default _
