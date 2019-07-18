import React, { Fragment, Component } from 'react';
import AddCustomModal from './AddCustomModal';

class EmptyCustom extends Component {
    state = {
        modalIsOpen: false,
    };

    openModalHandler = () => {
        this.setState({ modalIsOpen: true });
    };

    closeModalHandler = () => {
        this.setState({ modalIsOpen: false });
    };

    render() {
        const { modalIsOpen } = this.state;
        const text = "Sorry, but you don't have any custom filters yet";
        return (
            <Fragment>
                <div>empty icon</div>
                <div>
                    {text}
                </div>
                <button type="button" onClick={this.openModalHandler}>Add custom filter</button>
                {modalIsOpen && (
                <AddCustomModal
                    closeModalHandler={this.closeModalHandler}
                    modalIsOpen={modalIsOpen}
                />
                )}
            </Fragment>
        );
    }
}

export default EmptyCustom;
