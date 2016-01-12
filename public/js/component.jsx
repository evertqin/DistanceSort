/*jshint esnext:true*/

var React = require('react');
var Direction = require('./directions');

var defaultAddresses = ["787 E 3rd Ave, Columbus, OH 43201, USA",
	"2399 S Morgan St, Chicago, IL 60608, USA",
	"1 New York Place, New York, NY 10007, USA", "1 Barker Ave, White Plains, NY 10601, USA"
];

class Hub extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			addresses: defaultAddresses
		};
		this._onSubmit = this._onSubmit.bind(this);
	}
	_onSubmit(addresses) {
		this.setState({
			addresses: addresses
		});
	}

	render() {
		return (
			<div>
				<TextBoxControl onSubmit={this._onSubmit} />
				<ResultList addresses={this.state.addresses}/>
			</div>
		);
	}
}


class TextBoxControl extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
		this.state = {
			addresses: props.dests
		};
	}


	handleTextAreaChange(e) {
		this.setState({
			addresses: e.target.value
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		// assume addresses are multi-lines
		this.props.onSubmit(this.state.addresses);
	}

	render() {
		var list = this.props.dests.join('\n');
		return (
			<form className="addressForm" onSubmit={this.handleSubmit}>
			<textarea name="addressList" defaultValue={list} cols= "60" rows="10" onChange={this.handleTextAreaChange} />
			 <input type="submit" value="Submit" />
		</form>
		);
	}
}

TextBoxControl.defaultProps = {
	dests:defaultAddresses
}



class ResultList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			status: 'idle'
		};
	}

	componentWillReceiveProps() {
		this.setState({
			status: 'running'
		});
		var dir = new Direction("indianapolis", this.props.addresses);
		console.log(dir);
		dir.calcAll((ret) => {
			ret.sort((a, b) => {
				return a.duration.value - b.duration.value;
			});
			console.log(ret);
			this.setState({
				data: ret,
				status: 'done'
			});
		});

	}

	render() {
		var list = this.state.data.map((entry) => {
			return (
				<li key={entry.end_address}>{entry.end_address + "=>" + entry.duration.text}</li>
			);
		});

		if (this.state.status === 'running') {
			return <div>Running...</div>;
		} else {
			return <ol>{list}</ol>;
		}

	}
}

ResultList.defaultProps = {
	addresses: defaultAddresses
};
module.exports = Hub;