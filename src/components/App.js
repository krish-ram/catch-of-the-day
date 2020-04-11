import React from "react";
import Header from "./Header";
import Inventory from "./Inventory";
import Order from "./Order";
import sampleFishes from "../sample-fishes";
import Fish from "./Fish";

class App extends React.Component {
  state = {
    fishes: {},
    order: {}
  };

  addFish = fish => {
    //Take a copy of existing state
    const fishes = { ...this.state.fishes };
    //Add new fish to the fishes
    fishes[`fish${Date.now()}`] = fish;
    //set the new fishes to state
    this.setState({
      fishes: fishes
    });
  };

  addToOrder = key => {
    // Take copy of state
    const order = { ...this.state.order };
    // Either add to state or update number in our order
    order[key] = order[key] + 1 || 1;
    // call setState to update our state
    this.setState({ order: order });
  };

  loadSampleFishes = () => {
    this.setState({
      fishes: sampleFishes
    });
  };

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="fishes">
            {Object.keys(this.state.fishes).map(key => (
              <Fish
                key={key}
                index={key}
                details={this.state.fishes[key]}
                addToOrder={this.addToOrder}
              />
            ))}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} />
        {/* <Order {...this.state} /> */}
        <Inventory
          addFish={this.addFish}
          loadSampleFishes={this.loadSampleFishes}
        />
      </div>
    );
  }
}

export default App;
