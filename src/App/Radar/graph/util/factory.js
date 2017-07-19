const d3 = require('d3');
const _ = {
    map: require('lodash/map'),
    uniqBy: require('lodash/uniqBy'),
    capitalize: require('lodash/capitalize'),
    each: require('lodash/each')
};

const Radar = require('../models/radar');
const Quadrant = require('../models/quadrant');
const Ring = require('../models/ring');
const Blip = require('../models/blip');
const GraphingRadar = require('../graphing/radar');
const ExceptionMessages = require('./exceptionMessages');

function createRadar(data) {
    try {
        var rings = _.map(_.uniqBy(data, 'ring'), 'ring');
        var ringMap = {};
        var maxRings = 4;

        _.each(rings, function (ringName, i) {
            if (i == maxRings) {
                throw new Error(ExceptionMessages.TOO_MANY_RINGS);
            }
            ringMap[ringName] = new Ring(ringName, i);
        });

        var quadrants = {};
        _.each(data, function (blip) {
            if (!quadrants[blip.quadrant]) {
                quadrants[blip.quadrant] = new Quadrant(_.capitalize(blip.quadrant));
            }
            quadrants[blip.quadrant].add(new Blip(blip.name, ringMap[blip.ring], blip.isNew.toLowerCase() === 'true', blip.topic, blip.description))
        });

        var radar = new Radar();
        _.each(quadrants, function (quadrant) {
            radar.addQuadrant(quadrant)
        });

        var size = (window.innerHeight - 133) < 620 ? 620 : window.innerHeight - 133;

        new GraphingRadar(size, radar).init().plot();

    } catch (exception) {
        console.error(exception);
    }
}

module.exports = createRadar;
