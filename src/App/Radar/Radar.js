import React, { Component } from 'react';
import createRadar from 'App/Radar/graph/util/factory';
import data from '../../../radar.json';
import './graph/stylesheets/base.scss';

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
