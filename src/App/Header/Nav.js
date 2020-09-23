import React from 'react';
import { connect } from 'react-redux';
import { getConfigByName } from 'App/Config/entities';

function mapStateToProps(state) {
    const radarEnabled = getConfigByName(state, 'radar.enabled');

    return {
        radarEnabled
    };
}

function Nav({ radarEnabled }) {
    return (<ul className="nav">
        <li><a href="/resume.pdf">Résumé</a></li>
        <li><a href="https://github.com/shaine">GitHub</a></li>
        <li><a href="https://github.com/pulls?q=is%3Apr+author%3Ashaine+is%3Aclosed+is%3Apublic">OSS Contributions</a></li>
        <li><a href="https://www.linkedin.com/in/shaine/">LinkedIn</a></li>
    </ul>);
}

export default connect(mapStateToProps)(Nav);
