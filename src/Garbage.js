import React, { Component } from "react";
import { connect } from "react-redux";

// Actions
import { fetchGarbage } from "./redux/actions";

class Garbage extends Component {
  componentDidMount() {
    this.props.getGarbage();
  }

  render() {
    const rows = this.props.garbage.map(thing => (
      <tr key={thing.name}>
        <td className="text-center">{thing.name}</td>
      </tr>
    ));

    return (
      <div className="mt-5 mx-auto col-6 text-center">
        <h1>Garbage</h1>
        <table style={{ width: "100%" }}>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  garbage: state.things.public
});

const mapDispatchToProps = dispatch => ({
  getGarbage: () => dispatch(fetchGarbage())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Garbage);
