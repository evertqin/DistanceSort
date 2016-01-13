/*jshint esnext:true*/

var React = require('react');
var Direction = require('./directions');

var defaultAddresses = ["787 E 3rd Ave, Columbus, OH 43201, USA",
    "2399 S Morgan St, Chicago, IL 60608, USA",
    "1 New York Place, New York, NY 10007, USA", "1 Barker Ave, White Plains, NY 10601, USA"
];
var defaultAddressesText = defaultAddresses.join('\n');

var nyc = {
    lat: 40.7127,
    lng: -74.0059
};

var map, autocomplete, places, marker;

window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: nyc,
        scrollwheel: false,
        zoom: 7
    });

    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    // var directionsService = new google.maps.DirectionsService();

};

function getRandomColor() {
    var letters = '01234567890ABCEDF'.split('');
    var color = '#';
    for (let i = 0; i < 6; ++i) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getGeoCode(address, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            callback({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            });
        } else {
            callback(nyc);
        }


    });
}

function alertUser(message) {
    this.refs.alertType.classList.remove("alert-danger");
    this.refs.alertType.classList.add("alert-info");
}

function everythingIsFine() {
    if (this.refs.alertType.classList.contains("alert-danger")) {
        this.refs.alertType.classList.remove("alert-danger");
        this.refs.alertType.classList.add("alert-info");
    }
}

class Hub extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            origin: nyc,
            addresses: defaultAddresses,
            routes: []
        };
        this._update = this._update.bind(this);
    }

    componentWillMount() {

    }

    _update(key, value) {
        var obj = {};
        obj[key] = value;
        this.setState(obj);

    }

    render() {
        return (
            <div>
            <MapDisplay origin = {this.state.origin} routes={ this.state.routes } />
    		<TextBoxControl onSubmit={ this._update} />
    		<ResultList origin = {this.state.origin} addresses={ this.state.addresses }
                onGetResponse={ this._update.bind(this, "routes") }                 />
        </div>
        );
    }
}



class MapDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.directionsDisplay = [];
    }


    componentDidMount() {


    }
    componentWillReceiveProps(nextProps) {
        if (this.props.origin !== nextProps.origin) {
            map.setCenter(nextProps.origin);
        }
        var colors = [];
        this.directionsDisplay.forEach(u => {
            u.setMap(null);
        });
        this.directionsDisplay = [];
        nextProps.routes.forEach((route, i) => {
            if (!route) {
                return;
            }
            var rendererOptions = {
                preserveViewport: true,
                suppressMarkers: true,
                routeIndex: i,
                polylineOptions: {
                    strokeColor: getRandomColor(),
                    strokeOpacity: 0.7
                }
            };
            var dd = new google.maps.DirectionsRenderer(rendererOptions);
            dd.setMap(map);
            dd.setDirections(route);
            this.directionsDisplay.push(dd);

        });

    }
    render() {
        return (<div> </div>);
    }
}
MapDisplay.defaultProps = {
    origin: nyc
};


class TextBoxControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
        this.handleOriginChange = this.handleOriginChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        everythingIsFine = everythingIsFine.bind(this);
        alertUser = alertUser.bind(this);
        this.state = {
            origin: nyc,
            addresses: defaultAddressesText
        };

        this.addrAutocomplete = null;

    }
    onPlaceChanged() {
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (place.geometry) {
            marker.setIcon( /** @type {google.maps.Icon} */ ({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
            map.panTo(place.geometry.location);
            map.setZoom(15);
        } else {
            alertUser("Does not return a geo location");
        }
    }

    handleOriginChange(e) {
        everythingIsFine();

        if (!autocomplete) {
            autocomplete = new google.maps.places.Autocomplete(this.refs.originAC);
            places = new google.maps.places.PlacesService(map);
            autocomplete.addListener('place_changed', this.onPlaceChanged.bind(this));
        }

        getGeoCode.call(this, e.target.value, function(value) {
            this.setState({
                origin: value
            });
        }.bind(this));
    }

    handleAddressChange(e) {
        function addressEntered() {
            var place = this.addrAutocomplete.getPlace();
            if (place.geometry) {
                var addresses = this.state.addresses.split('\n');
                addresses.push(this.refs.addressAC.value);
                this.setState({
                    addresses: addresses.join('\n')
                });

            } else {
                alertUser("Does not return a geo location");
            }
        }

        if (this.refs.alertType.classList.contains("alert-danger")) {
            this.refs.alertType.classList.remove("alert-danger");
            this.refs.alertType.classList.add("alert-info");
        }

        if (!this.addrAutocomplete) {
            this.addrAutocomplete = new google.maps.places.Autocomplete(this.refs.addressAC);
            this.addrAutocomplete.addListener('place_changed', addressEntered.bind(this));

        }
    }

    handleTextAreaChange(e) {
        this.setState({
            addresses: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        // assume addresses are multi-lines
        this.props.onSubmit("addresses", this.state.addresses.split('\n'));
        this.props.onSubmit("origin", this.state.origin);
        console.log(this.state.origin);
    }

    render() {
        return (
            <form className="addressArea" onSubmit={this.handleSubmit}>
                <div ref="alertType" className="alert alert-info" role="alert">
                  <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                  <span ref="alertContent" className="sr-only">Status:</span>
                     Everything is fine
                </div>
            <div className="form-group">
                <label htmlFor="originInput">Origin</label>
                <input className="form-control" type='text' required
                       ref="originAC" name="origin" defaultValue="nyc" 
                       onChange={this.handleOriginChange}
                       /> 

            </div>
            <div className="form-group">
               <label htmlFor="addressesInput">Address</label>
                 <input className="form-control" type='text' 
                       ref="addressAC" name="address" defaultValue="1 New York Place, New York, NY 10007, USA" onChange={this.handleAddressChange}/> 
                <textarea name="addressList" value={this.state.addresses}
                                  cols="60" className="form-control"
                                  rows="10"
                                  onChange={ this.handleTextAreaChange} />
                <button type="submit" className="btn btn-default">Submit</button>
            </div>
           
        </form>
        );
    }
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
        if (nextProps.addresses === this.props.addresses && nextProps.origin === this.props.origin) {
            return;
        }
        this.setState({
            status: 'running'
        });
        var directionsService = new google.maps.DirectionsService();

        var dir = new Direction(directionsService, nextProps.origin, nextProps.addresses);
        dir.calcAll((ret) => {
            var result = [];
            ret.forEach(u => {
                if (u.status != google.maps.DirectionsStatus.OK) {
                    return
                };
                result.push(u.routes[0].legs[0])
            });
            result.sort((a, b) => {
                return a.duration.value - b.duration.value;
            });
            this.setState({
                data: result,
                status: 'done'
            });
            this.props.onGetResponse(ret);
        });

    }

    render() {
        var list = this.state.data.map((entry, index) => {
            return (
                <tr key={entry.end_address}> 
                    <th scope='row'>{index + 1}</th>
                    <td>{entry.end_address}</td>
                    <td>{entry.duration.text}</td>
                </tr>
            );
        });

        if (this.state.status === 'running') {
            return <div>Running... </div>;
        } else {
            return (
                <table className="table table-bordered addressArea">
                <thead>
                    <tr>
                    <th scope='row'>#</th>
                    <td>Address</td>
                    <td>Duration</td>
                    </tr>
                </thead>
                <tbody>
                 {list}
                 </tbody>
                </table>
            );
        }

    }
}

ResultList.defaultProps = {
    origin: nyc,
    addresses: defaultAddresses
};
module.exports = Hub;