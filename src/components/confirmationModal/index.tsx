import React, { useMemo } from "react";
import { ModalProps } from "src/components/modalManager";
import BaseModal from "src/components/baseModal";
import * as S from "./_confirmationModal.styled";
// import { useRecoilActionList } from "src/utils/recoil";

const ConfirmationModal: React.FC<ModalProps> = ({ modal }) => {
  const { actions, message, title } = modal;
  const recoilActionCallbacks = useMemo(() => actions.map((a) => a.cb), [actions]);
  // const actionCallbacks = useRecoilActionList(recoilActionCallbacks);

  return (
    <BaseModal>
      {title && <S.Title>{title}</S.Title>}
      <S.Body>{message}</S.Body>
      <S.Buttons>
        {actions.map((a, i) => (
          <button
            key={i}
            className={a.classNames ?? "btn btn-blue ml-2"}
            // onClick={actionCallbacks[i]}
          >
            {a.text}
          </button>
        ))}
      </S.Buttons>
    </BaseModal>
  );
};

export default ConfirmationModal;
