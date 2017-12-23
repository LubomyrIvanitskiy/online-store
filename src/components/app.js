import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Home from '../routes/home';
import Product from '../routes/product';
import Basket from '../routes/basket';
import Order from '../routes/order';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Header />
				<div class="wrapper">
					<Router onChange={this.handleRoute}>
						<Home path="/" />
						<Product path="/product/:id" />
						<Basket path="/basket" />
						<Order path="/order/:id/:email" />
					</Router>
				</div>
			</div>
		);
	}
}
