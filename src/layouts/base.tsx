import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react-lite";

import { UIContext } from "src/state/ui";

const BaseLayout = observer(({ children }) => {
  const uiStore = useContext(UIContext);

  return (
    <>
      <Helmet title={uiStore.title} />
      {children}
    </>
  );
});

export default BaseLayout;
