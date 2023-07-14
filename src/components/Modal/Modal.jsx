import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import css from './Modal.module.css';
import PropTypes from 'prop-types';

const modalRoot = document.querySelector('#root_modal');

const Modal = ({ largeImageURL, alt, onClose }) => {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  return createPortal(
    <div className={css.Overlay} onClick={handleBackdropClick}>
      <div className={css.Modal}>
        <img className={css.ModalImg} src={largeImageURL} alt={alt} />
      </div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  largeImageURL: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

export default Modal;
