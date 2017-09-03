#!/usr/bin/env node_modules/.bin/babel-node
// This file is intended to be run manually to populate DB content
import { createRadarEntry } from '../models/RadarEntry';
import db from '../helpers/db';
import radarEntries from './radar.2017.07.25.json';

db(() => {
    radarEntries.forEach(radarEntry => createRadarEntry(radarEntry, console.log));
});
