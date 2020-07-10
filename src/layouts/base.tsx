import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { RecoilRoot } from "recoil";

import { uiStore } from "src/state/ui";
import { useRecoilValue } from "recoil/dist";

const StateDependantLayout: FC = ({ children }) => {
  const title = useRecoilValue(uiStore.title);

  return (
    <>
      <Helmet title={title} />
      {children}
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
