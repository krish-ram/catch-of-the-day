import React from 'react';
import {getFunName} from '../helpers';
class StorePicker extends React.Component {

	gotoStore(event) {
		event.preventDefault();
		console.log('You have changed the url' + this.storeInput.value);
		//first get the value from the input box
		const storeId = this.storeInput.value;

		console.log(`Going to ${storeId}`);

		//Navigate to /store/:storeId on submit
		this.context.router.transitionTo(`/store/${storeId}`);

	}
	
	render() {
		//This is a comment
		return (
			<form className="store-selector" onSubmit={(e) => this.gotoStore(e)}>
				
				<h2>Please enter a Store</h2>
				
				<input type="text" required placeholder="Store Name" 
					defaultValue={getFunName()} ref={(input) => {this.storeInput = input}} />
				
				<button type="submit">Visit Store</button>
			</form>
		)
	}
}

StorePicker.contextTypes = {
	router: React.PropTypes.object
}

export default StorePicker;