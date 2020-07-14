import React, { ComponentType } from "react";
import { useRecoilValue } from "recoil";
import { IModal, uiStore } from "src/state/ui";

export enum ModalType {
  Confirmation = "Confirmation",
}

export type ModalProps = React.Attributes & { modal: IModal };

const ModalMap: {
  [P in keyof typeof ModalType]: React.LazyExoticComponent<ComponentType<ModalProps>>;
} = {
  [ModalType.Confirmation]: React.lazy(() => import("src/components/confirmationModal")),
};

// const ModalFallback = <BaseModal>Loading...</BaseModal>;
const ModalFallback = null;

const ModalManager = () => {
  const stack = useRecoilValue(uiStore.modalManager.stack);

  // ({ key: i, modal: m })
  return (
    <>
      {stack.map((m, i) => {
        const MComponent = ModalMap[m.type];
        return (
          <React.Suspense key={i} fallback={ModalFallback}>
            <MComponent modal={m} />
          </React.Suspense>
        );
      })}
    </>
  );
};

export default ModalManager;
