import React from 'react';

let Modal = ({
  title,
  children,
  okButton,
  cancelButton,
  onClose
}) =>
  <div className="modal is-active">
    <div className="modal-background" onClick={onClose}></div>
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">{title}</p>
        <button className="delete" aria-label="close" onClick={onClose}></button>
      </header>
      <section className="modal-card-body">
        {children}
      </section>
      <footer className="modal-card-foot">
        {okButton}
        {cancelButton}
      </footer>
    </div>
  </div>

Modal.defaultProps = {
  onClose: () => {}
}

export default Modal;
