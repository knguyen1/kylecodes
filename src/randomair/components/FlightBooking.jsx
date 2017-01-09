import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';

export default class FlightBooking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [{
                code: 'LGA',
                value: 'La Guardia'
            }, {
                code: 'EWK',
                value: 'Newark International Airport'
            }, {
                code: 'JFK',
                value: 'John F Kennedy International Airport'
            },{
                code: 'DFW',
                value: 'Dallas/Fort Worth International Airport'
            }],
        }
    }
    
    // handleUpdateInput = (value) => {
    //     this.setState()
    // }
    
    render() {
        //configure the behavior of autocomplete
        //autocomplete on value, but selects the text
        const dataSourceConfig = {
            text: 'value',
            value: 'code'
        };
        
        return (
            <div className="row">
                <div className="flight-booker-wrapper">
                    <h2 className="welcome-blurb">Book your next random adventure!</h2>
                </div>

                <div>
                    <AutoComplete
                        floatingLabelText="Leaving from"
                        dataSource={this.state.cities}
                        dataSourceConfig={dataSourceConfig}
                        filter={(s, k) => s !== '' && k.toLowerCase().includes(s.toLowerCase())}
                        textFieldStyle={{color: "#fff"}}
                    />
                </div>
            </div>
        )
    }
}