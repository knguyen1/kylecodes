import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
            <footer className="footer">
                <div className="row full-width">
                    <div>
                        &copy; {(new Date()).getUTCFullYear()} In collaboration with <a href="http://sharonchoe.com/">SHARONCHOE.COM</a>.
                    </div>
                    <div>
                        Made in NY using the only highest quality bits.
                    </div>
                </div>
            </footer>
        )
    }
}