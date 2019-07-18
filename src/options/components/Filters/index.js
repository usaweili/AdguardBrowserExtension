import React, { Fragment, Component } from 'react';
import browser from 'webextension-polyfill';
import sortBy from 'lodash/sortBy';
import Group from './Group';
import Checkbox from '../Settings/Checkbox';
import Filter from './Filter';
import EmptyCustom from './EmptyCustom';
import Search from './Search';


function filterUpdate(props) {
    const { rulesCount, lastUpdateDate, updateClickHandler } = props;
    return (
        <Fragment>
            <div>
                { `"Filter rules count: " ${rulesCount}` }
            </div>
            <div>
                {lastUpdateDate}
            </div>
            <div onChange={updateClickHandler}>update button</div>
        </Fragment>
    );
}

class Filters extends Component {
    state = {
        searchInput: '',
        searchSelect: 'all',
        filtersData: {},
        showFiltersByGroup: false,
    };

    async componentDidMount() {
        let filtersData;
        try {
            filtersData = await browser.runtime.sendMessage({ type: 'getFiltersData' });
        } catch (e) {
            console.log(e);
        }
        if (filtersData) {
            this.setState(state => ({
                ...state, ...filtersData,
            }));
        }
    }

    handleGroupSwitch = async ({ id, data }) => {
        const { groups } = this.state;

        try {
            await browser.runtime.sendMessage({ type: 'updateGroupStatus', id, value: data });
        } catch (e) {
            console.log(e);
        }

        const group = groups[id];
        this.setState(state => ({
            ...state,
            groups: {
                ...groups,
                [id]: {
                    ...group,
                    enabled: data,
                },
            },
        }));
    };

    groupClickHandler = groupId => (e) => {
        if (!e.target.closest('.checkbox')) {
            this.setState({ showFiltersByGroup: groupId });
        }
    };

    getEnabledFiltersByGroup = (group) => {
        const { filters } = this.state;
        return group.filters.map((filterId) => {
            const { enabled, name } = filters[filterId];
            return enabled && name;
        }).filter(name => !!name);
    };

    renderGroups = (groups) => {
        const sortedGroups = sortBy(Object.values(groups), 'order');
        return sortedGroups.map((group) => {
            const enabledFilters = this.getEnabledFiltersByGroup(group);
            return (
                <Group
                    key={group.id}
                    {...group}
                    enabledFilters={enabledFilters}
                    groupClickHandler={this.groupClickHandler(group.id)}
                >
                    <Checkbox
                        id={group.id}
                        value={group.enabled}
                        handler={this.handleGroupSwitch}
                    />
                </Group>
            );
        });
    };

    handleFilterSwitch = async ({ id, data }) => {
        const { filters } = this.state;

        try {
            await browser.runtime.sendMessage({ type: 'updateFilterStatus', id, value: data });
        } catch (e) {
            console.log(e);
        }

        const filter = filters[id];
        this.setState(state => ({
            ...state,
            filters: {
                ...filters,
                [id]: {
                    ...filter,
                    enabled: data,
                },
            },
        }));
    };


    renderFilters = filters => Object.values(filters).map((filter) => {
        const tags = filter.tags
            .map(tagId => this.state.tags[tagId])
            .filter(entity => entity);
        return (
            <Filter key={filter.id} filter={filter} tags={tags}>
                <Checkbox
                    id={filter.id}
                    value={filter.enabled}
                    handler={this.handleFilterSwitch}
                />
            </Filter>
        );
    });

    handleReturnToGroups = () => {
        this.setState({ showFiltersByGroup: false });
    };

    searchInputHandler = (e) => {
        const { value } = e.target;
        this.setState({ searchInput: value });
    };

    searchSelectHandler = (e) => {
        const { value } = e.target;
        this.setState({ searchSelect: value });
    };

    renderSearchResult = (filters = this.state.filters) => {
        const { searchInput, searchSelect } = this.state;
        const filtersValues = Object.values(filters);
        const searchQuery = new RegExp(searchInput, 'ig');

        return filtersValues.map((filter) => {
            const tags = filter.tags
                .map(tagId => this.state.tags[tagId])
                .filter(entity => entity);
            let searchMod;
            switch (searchSelect) {
                case 'enabled': searchMod = filter.enabled;
                    break;
                case 'disabled': searchMod = !filter.enabled;
                    break;
                default: searchMod = true;
            }

            if (filter.name.match(searchQuery) && searchMod) {
                return (
                    <Filter key={filter.id} filter={filter} tags={tags}>
                        <Checkbox
                            id={filter.id}
                            value={filter.enabled}
                            handler={this.handleFilterSwitch}
                        />
                    </Filter>
                );
            }
        });
    };

    render() {
        const {
            groups,
            showFiltersByGroup,
            searchInput,
            searchSelect,
        } = this.state;

        if (showFiltersByGroup !== false) {
            const { filters } = this.state;
            const group = groups[showFiltersByGroup];
            const groupFilters = group.filters.map(filterId => filters[filterId]);

            if (group.id === 0 && groupFilters.length === 0) {
                return (
                    <Fragment>
                        <div className="title-btn">
                            <button type="button" className="button button--back" onClick={this.handleReturnToGroups} />
                            <h2 className="title title--back-btn">{group.name}</h2>
                        </div>
                        <EmptyCustom />
                    </Fragment>
                );
            }
            return (
                <Fragment>
                    <div className="title-btn">
                        <button type="button" className="button button--back" onClick={this.handleReturnToGroups} />
                        <h2 className="title title--back-btn">{group.name}</h2>
                    </div>
                    <Search
                        searchInputHandler={this.searchInputHandler}
                        searchSelectHandler={this.searchSelectHandler}
                        searchInput={searchInput}
                        searchSelect={searchSelect}
                    />
                    {
                        !searchInput
                            ? filters && this.renderFilters(groupFilters)
                            : this.renderSearchResult(groupFilters)
                    }
                </Fragment>
            );
        }
        return (
            <Fragment>
                <h2 className="title">Filters</h2>
                <Search
                    searchInputHandler={this.searchInputHandler}
                    searchSelectHandler={this.searchSelectHandler}
                    searchInput={searchInput}
                    searchSelect={searchSelect}
                />
                {
                    !searchInput
                        ? groups && this.renderGroups(groups)
                        : this.renderSearchResult()
                }
            </Fragment>
        );
    }
}

export default Filters;
