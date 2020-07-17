import React, { useMemo } from "react";
import { ModalProps } from "src/components/modalManager";
import BaseModal from "src/components/baseModal";
import * as S from "./_confirmationModal.styled";
import { useCallbackInterface } from "src/utils/recoil";

const ConfirmationModal: React.FC<ModalProps> = ({ modal }) => {
  const { actions: recoilActions, message, title } = modal;
  const gci = useCallbackInterface();
  const actions = useMemo(
    () =>
      recoilActions.map((ra) => ({
        ...ra,
        cb: () => ra.cb(gci),
      })),
    [gci, recoilActions]
  );

  return (
    <BaseModal>
      {title && <S.Title>{title}</S.Title>}
      <S.Body>{message}</S.Body>
      <S.Buttons>
        {actions.map((a, i) => (
          <button key={i} className={a.classNames ?? "btn btn-blue ml-2"} onClick={a.cb}>
            {a.text}
          </button>
        ))}
      </S.Buttons>
    </BaseModal>
  );
};

export default ConfirmationModal;
