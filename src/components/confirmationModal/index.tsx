import React from "react";
import { ModalProps } from "src/components/modalManager";
import BaseModal from "src/components/baseModal";

const ConfirmationModal: React.FC<ModalProps> = () => {
  return (
    <BaseModal>
      <div style={{ padding: 16 }}>ConfirmationModal!</div>
    </BaseModal>
  );
};

export default ConfirmationModal;
