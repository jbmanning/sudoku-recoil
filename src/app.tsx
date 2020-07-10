import "src/styles/tailwind.output.css";
import "src/styles/reset.css";
import "src/styles/base.css";

import React from "react";
import BaseLayout from "src/layouts/base";
import Home from "src/pages/home";

const App = () => {
  return (
    <BaseLayout>
      test
      <Home />
    </BaseLayout>
  );
};

export default App;
