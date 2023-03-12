import VerifyButton from "@passbase/button/react";
import React from "react";

export const KycButton = () => {
  return (
    <VerifyButton
      apiKey={process.env.REACT_APP_PASSBASE_KEY || ""}
      onStart={() => {
        console.log("started");
      }}
      onError={(errorCode) => {
        console.log(errorCode);
      }}
      onFinish={(identityAccessKey) => {
        console.log(identityAccessKey);
      }}
    />
  );
};
