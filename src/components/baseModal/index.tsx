import React, { useCallback, useRef } from "react";

import * as S from "./_baseModal.styled";

type BaseModalProps = {
  onOutsideClick?: Function;
};

const BaseModal: React.FC<BaseModalProps> = ({ children, onOutsideClick }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const outsideClick = useCallback(
    (event) => {
      if (wrapperRef.current && event.target === wrapperRef.current) {
        event.stopPropagation();
        if (typeof onOutsideClick === "function") onOutsideClick();
      }
    },
    [wrapperRef, onOutsideClick]
  );

  return (
    <S.Wrapper ref={wrapperRef} onClick={outsideClick}>
      <S.ModalWrapper>{children}</S.ModalWrapper>
    </S.Wrapper>
  );
};

export default BaseModal;
