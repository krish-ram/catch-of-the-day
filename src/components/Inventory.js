import React from 'react';
import base from '../base';

import AddFishForm from './AddFishForm';

class Inventory extends React.Component {
	constructor() {
		super();
		this.renderInventory = this.renderInventory.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.authHandler = this.authHandler.bind(this);
		this.logout = this.logout.bind(this);

		this.state = {
			uid: null,
			owner: null
		}
	}

	componentDidMount() {
		base.onAuth((user) => {
			if(user) {
				this.authHandler(null, {user});
			}
		});
	}

	handleChange(e, key) {
	 	const fish = this.props.fishes[key];
	 	const updatedFish = {
	 		...fish,
	 		[e.target.name]: e.target.value
	 	};

	 	this.props.updateFish(key, updatedFish);
	}

	renderLogin() {
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage your Store's Inventory</p>
				<button onClick={() => this.authenticate('facebook')} className="facebook">Sign in with Facebook</button>
				<button onClick={() => 	this.authenticate('github')} className="github">Sign in with Github</button>
			</nav>
		)
	}
	
	renderInventory(key) {
		const fish = this.props.fishes[key];
		return (
			<div className="fish-edit" key={key}>
				<input type="text" name="name" value={fish.name} placeholder="Fish Name" 
					onChange={(e) => {this.handleChange(e, key)}} />
				<input type="text"  name="price" value={fish.price} placeholder="Fish Price" 
					onChange={(e) => {this.handleChange(e, key)}} />
				<select name="status" value={fish.status} onChange={(e) => {this.handleChange(e, key)}} >
					<option value="available">Fresh </option>
					<option value="unavailable">Sold Out! </option>
				</select>
				<textarea name="desc" value={fish.desc} placeholder="Fish Desc" 
					onChange={(e) => {this.handleChange(e, key)}} >
				</textarea>
				<input type="text" name="image" value={fish.image} placeholder="Fish Image" 
					onChange={(e) => {this.handleChange(e, key)}} />
				<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
			</div>
		)
	}

	authenticate(provider) {
		console.log('Trying to login');
		base.authWithOAuthPopup(provider, this.authHandler);

	}

	authHandler(err, authData) {
		console.log(authData);
		if (err) {
			console.log(err);
			return;
		}

		//grab the store name to query the db
		const storeRef = base.database().ref(this.props.storeId);

		storeRef.once('value', (snapshot) => {
			const data = snapshot.val() || {};

			// claim as owner if ther is no owner
			if (!data.owner) {
				storeRef.set({
					owner: authData.user.uid
				});
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			}); 
		});
	}

	logout() {
		base.unauth();
		this.setState({
			uid: null
		});
	}

	render() {
		const logout = <button onClick={this.logout}>Logout</button>
		if (!this.state.uid) {
			return <div>{this.renderLogin()}</div>;
		}

		if (this.state.uid !==this.state.owner) {
			return (
				<div>
					<p> Sorry, You aren't the owner of this store! </p>
					{logout}
				</div>
			)
		}
		return (
			<div> 
				<h2>Inventory</h2>
				{logout}
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish} />
				<button onClick={this.props.loadSamples} >Load Sample Fishes</button>
			</div>
		)
	}
}

Inventory.propTypes = {
	fishes: React.PropTypes.object.isRequired,
	removeFish: React.PropTypes.func.isRequired,
	addFish: React.PropTypes.func.isRequired,
	loadSamples: React.PropTypes.func.isRequired,
	updateFish: React.PropTypes.func.isRequired,
}

export default Inventory;