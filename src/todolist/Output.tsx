import React from "react";
import ToDo from "./Todo";
import FormProvider from "./FormProvider";

 function Output() {
  return (
    <FormProvider>
      <ToDo />
    </FormProvider>
  );
}

export default Output;

