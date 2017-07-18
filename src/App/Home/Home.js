/* eslint-disable */
import React from 'react';
import LoginLink from 'App/Login/LoginLink';

const Home = () => {
    return (
        <div className="homePage">
            <h1>Shaine Hatch-related stuff</h1>

            <ul className="nav">
                {/* <li><LoginLink /></li> */}
                <li><a href="/resume.pdf">Résumé</a></li>
                <li><a href="https://github.com/shaine">GitHub</a></li>
                <li><a href="https://github.com/pulls?q=is%3Apr+author%3Ashaine+is%3Aclosed+is%3Apublic">OSS Contributions</a></li>
                <li><a href="https://twitter.com/ShaineHatch">T̅ͮ̄̂͌̏͂witter</a></li>
                <li><a href="https://www.linkedin.com/in/shaine/">LinkedIn</a></li>
                <li><a href="/public/archer.jpg">Cat Photo</a></li>
            </ul>
        </div>
    );
};

export default Home;
