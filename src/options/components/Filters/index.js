import React, { Fragment, Component } from 'react';
import browser from 'webextension-polyfill';
import sortBy from 'lodash/sortBy';
import Group from './Group';
import Checkbox from '../Settings/Checkbox';
import Filter from './Filter';


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
        search: '',
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

    handleSearch = (e) => {
        console.log(e.target.value);
    };

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

    groupClickHandler = groupId => () => {
        this.setState({ showFiltersByGroup: groupId });
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

    renderFilters = filters => Object.values(filters).map(filter => (
        <Filter key={filter.id} name={filter.name}>
            <Checkbox
                id={filter.id}
                value={filter.enabled}
                handler={this.handleFilterSwitch}
            />
        </Filter>
    ));

    handleReturnToGroups = () => {
        this.setState({ showFiltersByGroup: false });
    };

    render() {
        const { groups, showFiltersByGroup } = this.state;
        if (showFiltersByGroup !== false) {
            const { filters } = this.state;
            const group = groups[showFiltersByGroup];
            const groupFilters = group.filters.map(filterId => filters[filterId]);
            return (
                <Fragment>
                    <button type="button" className="button" onClick={this.handleReturnToGroups}>back</button>
                    <h2 className="title">{group.name}</h2>
                    <input type="text" onChange={this.handleSearch} />
                    {filters && this.renderFilters(groupFilters)}
                </Fragment>
            );
        }
        return (
            <Fragment>
                <h2 className="title">Filters</h2>
                <input type="text" onChange={this.handleSearch} />
                {groups && this.renderGroups(groups)}
            </Fragment>
        );
    }
}

export default Filters;
