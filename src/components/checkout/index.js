import { h, Component } from 'preact';
import { getToken, makeTransaction } from '../../utils/cart';
let dropin = require('braintree-web-drop-in');

export default class CheckOut extends Component {
	state = {
		isLoading: true,
		message: ''
	};

	componentDidMount() {
		getToken().then(({ token }) => {
			const { items, total } = this.props;

			let form = document.querySelector('#bakset-form');

			dropin.create(
				{
					authorization: token,
					container: '#dropin-container'
					// paypal: {
					// 	flow: 'checkout',
					// 	amount: '10.00',
					// 	currency: 'EUR'
					// }
				},
				(createErr, instance) => {
					this.setState({
						isLoading: false
					});

					form.addEventListener('submit', e => {
						e.preventDefault();
						const data = Array.from(new FormData(form).entries()).reduce(
							(prev, next) => {
								prev[next[0]] = next[1];
								return prev;
							},
							{}
						);

						instance.requestPaymentMethod(
							(requestPaymentMethodErr, payload) => {
								// When the user clicks on the 'Submit payment' button this code will send the
								// encrypted payment information in a variable called a payment method nonce
								makeTransaction(payload.nonce, total, items, data).then(
									result => {
										instance.teardown(teardownErr => {
											// TOOD
										});

										if (result.success) {
											this.setState({
												isLoading: false,
												message: 'success'
											});
										}
										else {
											this.setState({
												isLoading: false,
												message: 'error'
											});
										}
									}
								);
							}
						);
					});
				}
			);
		});
	}

	render(props, { isLoading, message }) {
		let messageEl = null;
		if (message === 'success') {
			messageEl = <div class="alert alert--success">THANKS IS OK</div>;
		}
		else if (message === 'error') {
			messageEl = (
				<div class="alert alert--error">WHAT ? Something is not OK !</div>
			);
		}

		return (
			<div class="CheckOut">
				{messageEl}

				<div id="dropin-container" />
				{message !== 'success' && (
					<button id="submit-button" disabled={isLoading}>
						PAY
					</button>
				)}
			</div>
		);
	}
}
