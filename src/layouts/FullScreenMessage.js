import React from 'react';

let FullScreenMessage = ({title, message, modifier}) =>
  <section className={`hero is-large ${modifier} is-fullheight`}>
    <div className="hero-body">
      <div className="container has-text-centered">
        <h1 className="title">{title}</h1>
        <h2 className="subtitle">{message}</h2>
      </div>
    </div>
  </section>

export default FullScreenMessage;
