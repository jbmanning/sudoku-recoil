import React, { FC } from "react";
import { Helmet } from "react-helmet";

import { uiStore } from "src/state/ui";
import { RecoilRoot, useRecoilValue } from "recoil";
import ModalManager from "src/components/modalManager";

const StateDependantLayout: FC = ({ children }) => {
  const title = useRecoilValue(uiStore.title);

  return (
    <>
      <Helmet title={title} />
      {children}
      <ModalManager />
    </>
  );
};

const BaseLayout: FC = ({ children }) => {
  return (
    <RecoilRoot>
      <StateDependantLayout>{children}</StateDependantLayout>
    </RecoilRoot>
  );
};

export default BaseLayout;
