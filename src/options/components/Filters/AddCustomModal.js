import React, { Component, Fragment } from 'react';
import Modal from 'react-modal';
import browser from 'webextension-polyfill';
import background from '../../services/background';

Modal.setAppElement('#root');

const customStyles = {
    content: {
        width: '560px',
        height: 'auto',
        position: 'relative',
    },
};

// TODO [maximtop] consider move this component in the separate file
function ModalContentWrapper(props) {
    const { closeModalHandler, children, title } = props;
    return (
        <Fragment>
            <div>{title}</div>
            <div>
                <button type="button" onClick={closeModalHandler}>Close</button>
            </div>
            {children}
        </Fragment>
    );
}

const defaultState = {
    customUrlToAdd: '',
    stepToRender: 'input',
    filterToAdd: {},
};

class AddCustomModal extends Component {
    state = {
        ...defaultState,
    };

    handleInputChange = (e) => {
        const { value } = e.target;
        this.setState({ customUrlToAdd: value });
    };

    handleSendUrlToCheck = async () => {
        const { customUrlToAdd } = this.state;
        this.setState({ stepToRender: 'checking' });
        let result;
        try {
            result = await background.checkCustomUrl(customUrlToAdd);
        } catch (e) {
            console.log(e);
            this.setState({ stepToRender: 'error' });
        }
        this.setState({ filterToAdd: result, stepToRender: 'approve' });
    };

    renderInputStep = () => {
        const { closeModalHandler } = this.props;
        const { customUrlToAdd } = this.state;
        // TODO [maximtop] add enter key press handler
        return (
            <Fragment>
                <ModalContentWrapper closeModalHandler={closeModalHandler} title="New filter subscription">
                    <input
                        type="text"
                        placeholder="Enter URL or path"
                        onChange={this.handleInputChange}
                        value={customUrlToAdd}
                    />
                    <div>Enter valid URL or file path of the filter into field above.</div>
                    <div>You will be subscribed to that filter.</div>
                    <button type="button" onClick={this.handleSendUrlToCheck}>Next</button>
                </ModalContentWrapper>
            </Fragment>
        );
    };

    handleApprove = () => {
        this.setState(async (state, props) => {
            const { filterToAdd } = state;
            const { closeModalHandler } = props;
            if (!filterToAdd) {
                return null;
            }
            try {
                await background.addCustomFilter(filterToAdd);
            } catch (e) {
                console.log(e);
            }
            closeModalHandler();
            return {
                ...state,
                ...defaultState,
            };
        });
    };

    renderApproveStep = () => {
        const {
            filterToAdd: {
                title, description, version, ruleCount, homepage, url,
            },
        } = this.state;
        // TODO [maximtop] next line is used quite often, needs DRY refactoring
        const { closeModalHandler } = this.props;
        return (
            <Fragment>
                <ModalContentWrapper
                    closeModalHandler={closeModalHandler}
                    title="New filter subscription"
                >
                    <div>
                        <div>Title:</div>
                        <div>{title}</div>
                    </div>
                    <div>
                        <div>Description:</div>
                        <div>{description}</div>
                    </div>
                    <div>
                        <div>Version:</div>
                        <div>{version}</div>
                    </div>
                    <div>
                        <div>Rules count:</div>
                        <div>{ruleCount}</div>
                    </div>
                    <div>
                        <div>Homepage:</div>
                        <div>{homepage}</div>
                    </div>
                    <div>
                        <div>URL:</div>
                        <div>{url}</div>
                    </div>
                    <div>
                        <input id="trusted" type="checkbox" />
                        <label htmlFor="trusted">Trusted</label>
                    </div>
                    <button type="button" onClick={this.handleApprove}>Approve</button>
                </ModalContentWrapper>
            </Fragment>
        );
    };

    renderCheckingStep = () => {
        const { closeModalHandler } = this.props;
        return (
            <Fragment>
                <ModalContentWrapper closeModalHandler={closeModalHandler}>
                    <div>We are checking your url</div>
                </ModalContentWrapper>
            </Fragment>
        );
    };

    tryAgainHandler = () => {
        this.setState({ stepToRender: 'first' });
    };

    // TODO [maximtop] here we can show detailed error message than in the current version
    renderErrorStep = () => {
        const { closeModalHandler } = this.props;
        return (
            <Fragment>
                <ModalContentWrapper closeModalHandler={closeModalHandler}>
                    <h2>Error</h2>
                    <div>Error while adding your custom filter</div>
                    <div>
                        <button type="button" onClick={this.tryAgainHandler}>try again</button>
                    </div>
                </ModalContentWrapper>
            </Fragment>
        );
    };

    renderStep = () => {
        const { stepToRender } = this.state;
        switch (stepToRender) {
            case 'input': {
                return this.renderInputStep();
            }
            case 'checking': {
                return this.renderCheckingStep();
            }
            case 'error': {
                return this.renderErrorStep();
            }
            case 'approve': {
                return this.renderApproveStep();
            }
            default:
                throw new Error(`there is no such step: ${stepToRender}`);
        }
    };

    render() {
        const { modalIsOpen } = this.props;
        return (
            <Modal
                isOpen={modalIsOpen}
                style={customStyles}
            >
                {this.renderStep(this.state, this.props)}
            </Modal>
        );
    }
}

export default AddCustomModal;
