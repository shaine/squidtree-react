import React, { Component } from 'react';
import createRadar from 'App/Radar/graph/util/factory';
import './graph/stylesheets/base.scss';
import data from '../../../radar.json';

export default class Radar extends Component {
    componentDidMount() {
        if (__CLIENT__) {
            createRadar(data);
        }
    }

    render() {
        return (<div id="radar-container" />);
    }
}
