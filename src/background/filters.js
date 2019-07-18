import axios from 'axios';

const filtersMetaUrl = 'https://filters.adtidy.org/extension/chromium/filters.json';
const filtersTranslationsUrl = 'https://filters.adtidy.org/extension/chromium/filters_i18n.json';

const prepareData = (filtersMeta, filtersTranslations) => {
    const { groups, filters, tags } = filtersMeta;
    const updatedGroups = groups.reduce((acc, group) => {
        const { groupId, groupName, displayNumber } = group;
        const filterIds = filters
            .filter(filter => filter.groupId === groupId)
            .map(filter => filter.filterId);
        const updatedGroup = {
            id: groupId,
            name: groupName,
            order: displayNumber,
            ...group,
            filters: filterIds,

        };

        delete updatedGroup.groupId;
        delete updatedGroup.groupName;
        delete updatedGroup.displayNumber;

        return {
            ...acc,
            [groupId]: updatedGroup,
        };
    }, {});

    // add custom filter
    updatedGroups[0] = {
        id: 0, name: 'Custom', order: 99, filters: [],
    };

    const updatedFilters = filters.reduce((acc, filter) => {
        const { filterId } = filter;
        const updatedFilter = {
            id: filterId,
            ...filter,
        };
        delete updatedFilter.filterId;
        return { ...acc, [filterId]: updatedFilter };
    }, {});

    const updatedTags = tags.reduce((acc, tag) => {
        const { tagId, keyword } = tag;
        let updatedKeyword = keyword;
        if (keyword.match(/reference/)) {
            return acc;
        }
        if (keyword.match(/(purpose|platform)/)) {
            [, updatedKeyword] = keyword.split(':');
        }
        const tagMeta = filtersTranslations.tags[tagId];
        if (!tagMeta) {
            return acc;
        }
        const { description, name } = filtersTranslations.tags[tagId].en;
        const updatedTag = {
            id: tagId,
            description,
            name,
            ...tag,
            keyword: updatedKeyword,
        };
        delete updatedTag.tagId;
        return { ...acc, [tagId]: updatedTag };
    }, {});
    return { groups: updatedGroups, filters: updatedFilters, tags: updatedTags };
};

const downloadFilters = async () => {
    const [{ data: filtersMeta }, { data: filtersTranslations }] = await Promise.all([
        axios.get(filtersMetaUrl),
        axios.get(filtersTranslationsUrl),
    ]);
    return prepareData(filtersMeta, filtersTranslations);
};

const getFiltersMeta = (() => {
    let filtersMeta;
    return async () => {
        if (!filtersMeta) {
            try {
                filtersMeta = await downloadFilters();
                console.log('Filters metadata downloaded successfully');
            } catch (e) {
                console.log(e);
            }
        }
        return Promise.resolve(filtersMeta);
    };
})();

// eslint-disable-next-line import/prefer-default-export
export { getFiltersMeta };
