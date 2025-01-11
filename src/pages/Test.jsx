import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Don't forget to import styles

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
    };
  }

  setStartDate = (picked) => {
    this.setState({ startDate: picked });
  };

  render() {
    return (
      <DatePicker
        style={{ width: "2em", height: "20vh", padding: "2em" }}
        selected={this.state.startDate}
        onChange={this.setStartDate}
        dateFormat="dd/MM/yyyy"
        minDate={new Date()}
        showDisabledMonthNavigation
      />
    );
  }
}