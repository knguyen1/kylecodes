// var React = require('react');
// var ReactDOM = require('react-dom');

import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './components/Header.jsx';
import FlightBooking from './components/FlightBooking.jsx';

//listen for touch/tap.clickevents, necessary until official react version is released
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class RandmAir extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <FlightBooking />
            </div>
        )
    }
}

ReactDOM.render(
    <MuiThemeProvider>
        <RandmAir />
    </MuiThemeProvider>,
    document.getElementById('app')
);