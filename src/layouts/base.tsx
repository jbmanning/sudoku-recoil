import React, { useContext, FC } from "react";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react-lite";

import { UIContext } from "src/state/ui";

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
  return <StateDependantLayout>{children}</StateDependantLayout>;
};

export default BaseLayout;
