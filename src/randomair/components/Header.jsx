import React from 'react';

export default class Header extends React.Component {
    render() {
        return (
            <header>
                <div className="top-bar">
                    <div className="row">
                        <div className="top-bar-left">
                            <h1 id="logo"><span className="pop">RANDM</span>AIR</h1>
                        </div>
                        <div className="top-bar-middle">Your next lorem ipsum adventure awaits!</div>
                        <div className="top-bar-right"></div>
                    </div>
                </div>
            </header>
        )
    }
}