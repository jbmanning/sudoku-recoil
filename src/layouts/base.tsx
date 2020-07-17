import React, { useContext, FC } from "react";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react-lite";
import { RecoilRoot } from "recoil";

import { UIContext } from "src/state/ui";
import { useRecoilValue } from "recoil/dist";

const StateDependantLayout = observer(({ children }) => {
  const uiStore = useContext(UIContext);

  return (
    <>
      <Helmet title={uiStore.title} />
      {children}
    </>
  );
});

const BaseLayout: FC = ({ children }) => {
  return (
    <RecoilRoot>
      <StateDependantLayout>{children}</StateDependantLayout>
    </RecoilRoot>
  );
};

export default BaseLayout;
