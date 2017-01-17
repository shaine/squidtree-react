import React from 'react';
import path from 'path';
import marked, { lexer } from 'marked';
import Helmet from 'react-helmet';
import { provideHooks } from 'redial';
import { PRIVATE_BLOG, PUBLIC_BLOG } from 'routes';
import moment from 'moment';

const RELATIVE_MARKDOWN_LOCATION = '../../../content';

// TODO add colorization

function fetch({ setProps, routeProps: { routeType } }) {
    let postType;
    switch (routeType) {
        case PUBLIC_BLOG:
            postType = 'words';
            break;

        case PRIVATE_BLOG:
            postType = 'thoughts';
            break;

        default:
            throw new Error('Invalid blog type');
    }

    if (__SERVER__) {
        const fs = require('fs');

        const blogPosts = [];
        fs.readdirSync(path.resolve(__dirname, RELATIVE_MARKDOWN_LOCATION, postType)).forEach(filename => {
            const slug = filename.replace(/\.md$/, '');

            // Don't show hidden files
            if (slug.indexOf('.') === 0) {
                return;
            }

            const postMarkdown = fs.readFileSync(path.resolve(
                __dirname,
                RELATIVE_MARKDOWN_LOCATION,
                postType,
                `${slug}.md`
            ), 'utf8');

            const title = lexer(postMarkdown).reduce((titleAggregator, element) => {
                if (titleAggregator) {
                    // Short circuit if the title has been found
                    return titleAggregator;
                } else if (element.type === 'heading' && element.depth === 1) {
                    // See if this is the heading
                    return element.text;
                }

                // Nothing found yet, pass along
                return titleAggregator;
            }, '');

            const date = lexer(postMarkdown).reduce((dateAggregator, element) => {
                if (dateAggregator) {
                    // Short circuit if the title has been found
                    return dateAggregator;
                } else if (element.type === 'paragraph' && element.text.match(/^<time>/)) {
                    // See if this is the date
                    return new Date(element.text.match(/^<time>(.+?)<\/time>/)[1]);
                }

                // Nothing found yet, pass along
                return dateAggregator;
            }, '');

            const postHtml = marked(postMarkdown);

            blogPosts.push({
                date,
                dateFormatted: moment(date).format('YYYY.MM.DD'),
                postHtml,
                slug,
                title
            });
        });

        blogPosts.sort((a, b) => (a.date < b.date ? 1 : -1));

        setProps({
            blogPosts
        });
    }
}

const BlogList = ({ blogPosts }) => (
    <div className="blogListPage">
        <Helmet
            title="Blog Posts"
        />

        <ul className="blogList">
            {blogPosts.map(blogPost => (
                <li key={blogPost.slug}><a href={`/words/${blogPost.slug}/`}>
                    {blogPost.title}
                    {blogPost.date && (<span> (<time>{blogPost.dateFormatted}</time>)</span>)}
                </a></li>
            ))}
        </ul>
    </div>
);

export default provideHooks({ fetch })(BlogList);
