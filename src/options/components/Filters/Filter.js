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
    const tagString = `#${tag.keyword}`;
    return (
        <div key={tag.id} className="setting__tag">{tagString}</div>
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
        <div className="setting" role="presentation">
            <div className="setting__info">
                <div className="setting__title">
                    {name}
                </div>
                <div className="setting__desc">
                    <div className="setting__desc-item">
                        {description}
                    </div>
                    <div className="setting__desc-item">
                        {`version: ${version} updated: ${formatDate(timeUpdated)}`}
                    </div>
                </div>
                {tags && (
                <div className="setting__tags">
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
