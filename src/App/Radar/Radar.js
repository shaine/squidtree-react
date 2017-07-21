import React, { Component } from 'react';
import createRadar from 'App/Radar/graph/util/factory';
import './graph/stylesheets/base.scss';

export default class Radar extends Component {
    componentDidMount() {
        if (__CLIENT__) {
            createRadar([{
                name: 'Test 1',
                description: 'test',
                isNew: 'true',
                quadrant: 'tools',
                ring: 'adopt'
            }, {
                name: 'Test 2',
                description: 'test',
                isNew: 'true',
                quadrant: 'languages & frameworks',
                ring: 'trial'
            }, {
                name: 'Test 3',
                description: 'test',
                isNew: 'false',
                quadrant: 'platforms',
                ring: 'assess'
            }, {
                name: 'Test 4',
                description: 'test',
                isNew: 'false',
                quadrant: 'techniques',
                ring: 'hold'
            }]);
        }
    }

    render() {
        return (<div id="radar-container" />);
    }
}
