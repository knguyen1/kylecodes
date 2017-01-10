import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import jsonp from 'jsonp';

function jsonCallback(data) {
    alert(data);
}

export default class FlightBooking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            airports: []
        };
        this.handleUpdateInput = this.handleUpdateInput.bind(this)
    }
    
    handleUpdateInput(value) {
        let url = "https://iatacodes.org/api/v6/autocomplete.jsonp?api_key=2546a200-9796-45e2-a80a-eeb141141505";
        url += "&query=" + value;
        
        jsonp(url, null, (err, data) => {
            if(err){
                console.log(err);
            }
            else if(data.response) {
               //this.setState({airports: data.response.airports_by_cities})

                if(data.response.airports.length)
                    this.setState({airports: data.response.airports});
                else if(data.response.airports_by_cities.length)
                    this.setState({airports: data.response.airports_by_cities});
                else if(data.response.airports_by_countries.length)
                    this.setState({airports: data.response.airports_by_countries});
            }
        });
        
        
    };
    
    render() {
        //configure the behavior of autocomplete
        //autocomplete on value, but selects the text
        const dataSourceConfig = {
            text: 'name',
            value: 'code'
        };
        
        return (
            <div className="row">
                <div className="flight-booker-wrapper">
                    <h2 className="welcome-blurb">Book your next random adventure!</h2>
                </div>

                <div>
                    <AutoComplete
                        hintText="City or airport"
                        floatingLabelText="Leaving from"
                        dataSource={this.state.airports}
                        dataSourceConfig={dataSourceConfig}
                        filter={AutoComplete.noFilter}
                        onUpdateInput={this.handleUpdateInput}
                        openOnFocus={true}
                    />
                </div>
            </div>
        )
    }
}