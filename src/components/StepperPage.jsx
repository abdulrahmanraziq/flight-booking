import React, { Component } from "react";
import { Stepper, StepContent, StepLabel, Step } from "@mui/material";

export default class StepperPage extends Component {
  render() {
    return (
      <div>
        <Stepper alternativeLabel activeStep={0}>
          <Step>
            <StepLabel>Step 1</StepLabel>
            <StepContent>balabizo</StepContent>
          </Step>
          <Step>
            <StepLabel>Step 2</StepLabel>
          </Step>
          <Step>
            <StepLabel>Step 3</StepLabel>
          </Step>
        </Stepper>
      </div>
    );
  }
}
