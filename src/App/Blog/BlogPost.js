import React from 'react';
import path from 'path';
import marked, { lexer } from 'marked';
import Helmet from 'react-helmet';
import slugify from 'slugify';
import { provideHooks } from 'redial';
import { PRIVATE_BLOG, PUBLIC_BLOG } from 'routes';

const RELATIVE_MARKDOWN_LOCATION = '../../../content';

// TODO add colorization

function fetch({ setProps, params: { slug: urlSlug }, routeProps: { routeType } }) {
    let postType = 'work';
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
        // Sanitize slug for FS usage
        const slug = slugify(urlSlug);

        let postMarkdown = '';

        try {
            postMarkdown = fs.readFileSync(path.resolve(
                __dirname,
                RELATIVE_MARKDOWN_LOCATION,
                postType,
                `${slug}.md`
            ), 'utf8');
        } catch (e) {
            // Return to 404

            return Promise.reject();
        }

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

        const date = lexer(postMarkdown).reduce((titleAggregator, element) => {
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

        const postHtml = marked(postMarkdown);

        const post = {
            date,
            postHtml,
            slug,
            title
        };

        setProps(post);

        return post;
    }

    return false;
}

const BlogPost = ({ postHtml, title }) => (
    <div className="blogPostPage">
        <Helmet
            title={title}
        />

        <div dangerouslySetInnerHTML={{ __html: postHtml }} />
    </div>
);

export default provideHooks({ fetch })(BlogPost);
