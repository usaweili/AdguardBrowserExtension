import React from 'react';
import PropTypes from 'prop-types';
import './filter.pcss';

const formatDate = (date) => {
    const dateObj = new Date(date);
    const formatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return dateObj.toLocaleDateString('default', formatOptions);
};

const renderTags = tags => tags.map((tag) => {
    console.log(tag);
    const tagString = `#${tag.keyword}`;
    return (
        <div key={tag.id} className="filter__tag">{tagString}</div>
    );
});

function Filter(props) {
    const {
        filter, children, tags,
    } = props;
    const {
        name, description, version, timeUpdated,
    } = filter;
    return (
        <div className="filter" role="presentation">
            <div className="filter__info">
                <div className="filter__title">
                    {name}
                </div>
                <div className="filter__description">
                    {description}
                </div>
                <div className="filter__version">
                    {`version: ${version}`}
                </div>
                <div className="filter__updated">
                    {`updated: ${formatDate(timeUpdated)}`}
                </div>
                {tags && (
                <div className="filter__tags">
                    {renderTags(tags)}
                </div>
                )}
                {children}
            </div>
        </div>
    );
}

Filter.propTypes = {
    filter: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.node]).isRequired,
};

export default Filter;
