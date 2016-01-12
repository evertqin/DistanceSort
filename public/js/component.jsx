/*jshint esnext:true*/

var React = require('react');
var Direction = require('./directions');

var defaultAddresses = ["787 E 3rd Ave, Columbus, OH 43201, USA",
	"2399 S Morgan St, Chicago, IL 60608, USA",
	"1 New York Place, New York, NY 10007, USA", "1 Barker Ave, White Plains, NY 10601, USA"
];
var defaultAddressesText = defaultAddresses.join('\n');

class Hub extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addresses: defaultAddresses,
            routes: []
        };
        this._onSubmit = this._onSubmit.bind(this);
        this._onGetResponse = this._onGetResponse.bind(this);
    }

    _onSubmit(addresses) {
        this.setState({
            addresses: addresses
        });
    }

    _onGetResponse(response) {
        this.setState({
            routes: response
        });
    }

    _onGetDirectionsService(service){
    	this.setState({directionsService:service});
    }

    render() {
        return ( 
        <div>
            <MapDisplay routes={ this.state.routes } />
    		<TextBoxControl onSubmit={ this._onSubmit } />
    		<ResultList addresses={ this.state.addresses }
                onGetResponse={ this._onGetResponse }                 />
        </div>
		);
    }
}


class MapDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var map;

        window.initMap = function () {
            var indianapolis = {
                lat: 39.79,
                lng: -86.14
            };

            var map = new google.maps.Map(document.getElementById('map'), {
                center: indianapolis,
                scrollwheel: false,
                zoom: 7
            });


            var directionsDisplay = new google.maps.DirectionsRenderer({
                map: map
            });

            var directionsService = new google.maps.DirectionsService();
            this.setState({map:map});

        }.bind(this);

    }
    componentWillReceiveProps(nextProps) {
    	var colors = ['red', 'black', 'blue', 'cyan'];
        nextProps.routes.forEach((route, i) => {
        	var rendererOptions = {
    preserveViewport: true,         
    suppressMarkers:true,
    routeIndex:i,
    polylineOptions: {strokeColor: colors[i], strokeOpacity:0.7}
};
        	var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        	 directionsDisplay.setMap(this.state.map);
        	 directionsDisplay.setDirections(route);
    
        });

    }
    render() {
        return (<div> </div>);
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
        this.props.onSubmit(this.state.addresses.split('\n'));
    }

    render() {
        return (
        <form className="addressForm" onSubmit={this.handleSubmit}>
			<textarea name="addressList" defaultValue={this.props.dests}
                              cols="60"
                              rows="10"
                              onChange={ this.handleTextAreaChange} />
    		<input type="submit" value="Submit" />
        </form>
				);
    }
}

TextBoxControl.defaultProps = {
    dests: defaultAddressesText
}



class ResultList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            status: 'idle'
        };
    }

    componentWillReceiveProps(nextProps) {
    	if(nextProps.addresses === this.props.addresses){
    		return;
    	}
        this.setState({
            status: 'running'
        });
        var directionsService = new google.maps.DirectionsService();
        var dir = new Direction(directionsService, "indianapolis", nextProps.addresses);
        dir.calcAll((ret) => {
                var result = [];
                ret.forEach(u => {
                    result.push(u.routes[0].legs[0])
                });
                result.sort((a, b) => {

                    return a.duration.value - b.duration.value;
                });
                console.log(result);
                this.setState({
                    data: result,
                    status: 'done'
                });
                this.props.onGetResponse(ret);
        });

    }

    render() {
        var list = this.state.data.map((entry) => {
            return ( 
            	<li key={entry.end_address}>
                {entry.end_address + "=>" + entry.duration.text}
            </li>);
        });

        if (this.state.status === 'running') {
            return <div>Running... </div>;
        } else {
            return <ol>{list}</ol>;
            }

    	}
}	

ResultList.defaultProps = {
    addresses: defaultAddresses
};
module.exports = Hub;
