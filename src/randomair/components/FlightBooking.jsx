import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import jsonp from 'jsonp';
import axios from 'axios';

const formatAmPm = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;

    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

export default class FlightBooking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'Book your next random adventure!',
            backgroundImage: '/img/FFE4g.jpg',
            roundTripToggle: false, //false = round trip, true = one way
            airports: [],
            originAirport: {},
            destinationAirport: {},
            departing: null, 
            returning: null ,
            tripOption: [],
            loading: false
        };
        this.handleRoundTripToggle = this.handleRoundTripToggle.bind(this);
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.handleNewRequest = this.handleNewRequest.bind(this);
        this.handleChangeDepart = this.handleChangeDepart.bind(this);
        this.handleChangeReturn = this.handleChangeReturn.bind(this);
        this.handleSearchFlights = this.handleSearchFlights.bind(this);
    }

    handleRoundTripToggle() {
        //false = round trip, true = one way
        this.setState({roundTripToggle: !this.state.roundTripToggle});
    }
    
    handleUpdateInput(value) {
        let url = "https://iatacodes.org/api/v6/autocomplete.jsonp?api_key=2546a200-9796-45e2-a80a-eeb141141505";
        url += "&query=" + value;
        
        jsonp(url, null, (err, data) => {
            if(err){
                console.log(err);
            }
            else if(data.response) {
                if(data.response.airports.length)
                    this.setState({airports: data.response.airports});
                else if(data.response.airports_by_cities.length)
                    this.setState({airports: data.response.airports_by_cities});
                else if(data.response.airports_by_countries.length)
                    this.setState({airports: data.response.airports_by_countries});
            }
        });
    };

    handleNewRequest(value, index) {
        if(index < 0)
            this.setState({originAirport: this.state.airports[0]})
        else this.setState({originAirport: value});
    }

    handleChangeDepart(event, date) {
        if(this.state.returning) {
            if(date.getTime() >= this.state.returning.getTime())
                this.setState({departing: date, returning: date});
            else
                this.setState({departing: date})
        } else {
            this.setState({departing: date})
        }
    }

    handleChangeReturn (event, date) {
        this.setState({returning: date})
    }

    handleSearchFlights() {
        this.setState({loading: true});
        
        //step 1) get a random city
        axios.get('/api/randomair/get_random_city')
            .then(res => {
                this.setState({message: res.data.name + ', ' + res.data.country});

                let url = "https://iatacodes.org/api/v6/nearby.jsonp?api_key=2546a200-9796-45e2-a80a-eeb141141505";
                url += "&lat=" + res.data.lat + "&lng=" + res.data.lon + "&distance=100";

                //get nearest airport to city, any airport
                jsonp(url, null, (err, data) => {
                    //console.log(err);
                    //console.log(data);
                    const nearestAirports = data.response.filter(a => {
                        return !a.name.toLowerCase().includes("heliport") &&
                            !a.name.toLowerCase().includes("regional") &&
                            !a.name.toLowerCase().includes("municipal") &&
                            !a.name.toLowerCase().includes("rail");
                    });

                    console.log(data);
                    
                    let destinationAirport;
                    for(let i = 0; i < nearestAirports.length; i++) {
                        const nearestAirport = nearestAirports[i];
                        if(nearestAirport.name.toLowerCase().includes("interna")) {
                            destinationAirport = nearestAirport;
                            break;
                        } else {
                            if(i === nearestAirports.length - 1) {
                                destinationAirport = nearestAirports[0];
                            }
                        }
                    }
                    this.setState({destinationAirport: destinationAirport});

                    //step 2) get a photo of the city from an api
                    //change background image
                    axios.get('/api/randomair/get_photo_from_city/' + res.data.name).then(response => {
                        this.setState({backgroundImage: '/img/' + response.data});
                    }).catch(err => {
                        console.log(err);
                    });

                    //step 3) get a list of prices and flights
                    //make an API call to QPX
                    // let payload = {
                    //     slice: {
                    //         origin: this.state.originAirport.code,
                    //         destination: this.state.destinationAirport.code,
                    //         date: '2017-01-31'
                    //     },
                    //     passengers: {
                    //         adultCount: 1,
                    //         infantInLapCount: 0,
                    //         infantInSeatCount: 0,
                    //         childCount: 0,
                    //         seniorCount: 0
                    //     },
                    //     solutions: 20,
                    //     refundable: false
                    // };
                    
                    let payload = {
                        "request": {
                            "passengers": {
                                "adultCount": "1"
                            },
                            "slice": [
                                {
                                    "origin": this.state.originAirport.code,
                                    "destination": this.state.destinationAirport.code,
                                    "date": this.state.departing.toISOString().slice(0,10)//"2017-02-19"
                                }
                            ],
                            "solutions": "10"
                        }
                    };
                    
                    const flightsApiUrl = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyDOifOrADrJ_AjlvZtRuyjdZMGhow584Os';

                    axios.post(flightsApiUrl, payload).then(res => {
                        this.setState({tripOption: res.data.trips.tripOption, loading: false});
                    }).catch(err => {
                        console.log(err);
                    });
                });
            })
            .catch(err => {
                console.log(err)
            });
        
    }
    
    render() {
        //configure the behavior of autocomplete
        //autocomplete on value, but selects the text
        const dataSourceConfig = {
            text: 'name', //'la guardia'
            value: 'code' //'lga'
        };
        
        return (
            <div className="row">
                <div className="random-city" style={{background: 'url(' + this.state.backgroundImage +')', backgroundPosition: 'center', overflow: 'hidden'}}>
                    <h2 className="welcome-blurb">{this.state.message}</h2>
                </div>
                <div className="flight-booker-wrapper">
                    <div className="flight-inputs">
                        <div className="widgets">
                            <div className="widgets-kickout">
                                <div className="span4 widgets-holder">

                                </div>
                                <div className="widgets-flight-info-shadow-chop">
                                    <div className="span8 widgets-flight-info">
                                        <div className="clearfix"></div>
                                        <div className="span6">
                                            <h3 className="why">Book Flights</h3>
                                            <Toggle
                                                label={this.state.roundTripToggle ? "One way" : "Round trip"}
                                                onToggle={this.handleRoundTripToggle}
                                                labelPosition="right"
                                            />
                                            <AutoComplete
                                                hintText="City or airport"
                                                floatingLabelText="Leaving from"
                                                dataSource={this.state.airports}
                                                dataSourceConfig={dataSourceConfig}
                                                filter={AutoComplete.noFilter}
                                                onUpdateInput={this.handleUpdateInput}
                                                openOnFocus={true}
                                                onNewRequest={this.handleNewRequest}
                                                searchText={this.state.originAirport.name || ''}
                                            />
                                            <DatePicker
                                                container="inline"
                                                floatingLabelText="Departing"
                                                locale="en-US"
                                                firstDayOfWeek={0}
                                                autoOk={true}
                                                value={this.state.departing}
                                                minDate={new Date()}
                                                onChange={this.handleChangeDepart}
                                            />

                                            {/*set the opacity of this object to be 0 if it's a one way*/}
                                            {!this.state.roundTripToggle ?
                                                <DatePicker
                                                    container="inline"
                                                    floatingLabelText="Returning"
                                                    locale="en-US"
                                                    firstDayOfWeek={0}
                                                    autoOk={true}
                                                    value={this.state.returning}
                                                    minDate={this.state.departing ? this.state.departing : new Date()}
                                                    onChange={this.handleChangeReturn}
                                                /> : <div style={{height:72}}>&nbsp;</div> }
                                            
                                            {/*value={this.state.returning}*/}
                                            <RaisedButton
                                                onClick={() => this.handleSearchFlights()}
                                                primary={true}
                                                label="Search"
                                                style={{marginTop: 12}}
                                            />
                                        </div>
                                        <div className="span6">
                                            <h3 className="why">Why?</h3>
                                            <p className="flight-blurb">The best journeys are the ones without a destination.  Let this app randomly pick a city for you and find the best flights.</p>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.loading?
                    <LinearProgress mode="indeterminate" />
                    :
                    <div></div>
                }

                {this.state.tripOption.map(trip => {

                    const firstLeg = trip.slice[0].segment[0];
                    const firstLegDeparture = new Date(firstLeg.leg[0].departureTime);
                    const firstLegArrival = new Date(firstLeg.leg[0].arrivalTime);

                    const lastLeg = trip.slice[0].segment.slice(-1)[0];
                    const lastLegDeparture = new Date(lastLeg.leg.slice(-1)[0].departureTime);
                    const lastLegArrival = new Date(lastLeg.leg.slice(-1)[0].arrivalTime);

                    return (
                    <Card key={trip.id}>
                        <CardText>
                            <div className="flight-info-container">
                                <div className="flight-info-card">
                                    <p><i className="fa fa-plane fa-4x" aria-hidden="true"></i></p>
                                    <p>{firstLeg.flight.carrier} {firstLeg.flight.number}</p>
                                </div>

                                <div className="flight-info-card">
                                    <p><h5 className="city">Origin City</h5></p>
                                    <p className="time">{formatAmPm(firstLegDeparture)}</p>
                                    <p className="time">{firstLeg.leg[0].origin}</p>
                                    <p className="city">{firstLegDeparture.getUTCMonth() + '/' + firstLegDeparture.getUTCDate() + '/' + firstLegDeparture.getUTCFullYear()}</p>
                                </div>

                                <div className="flight-info-card">
                                    <i className="fa fa-long-arrow-right fa-4x" aria-hidden="true"></i>
                                </div>

                                <div className="flight-info-card">
                                    <p><h5 className="city">Arrival City</h5></p>
                                    <p className="time">{formatAmPm(lastLegDeparture)}</p>
                                    <p className="time">{lastLeg.leg[0].destination}</p>
                                    <p className="city">{lastLegArrival.getUTCMonth() + '/' + lastLegArrival.getUTCDate() + '/' + lastLegArrival.getUTCFullYear()}</p>
                                </div>

                                <div className="flight-info-card">
                                    <p><h5>Duration & Price</h5></p>
                                    <p>{Math.floor(trip.slice[0].duration / 60)}h {trip.slice[0].duration % 60} m</p>
                                    <p><h2 className="price">${trip.saleTotal.slice(3)}</h2></p>
                                </div>
                            </div>
                        </CardText>
                    </Card>
                    )
                }
                )
                }
                
            </div>
        )
    }
}