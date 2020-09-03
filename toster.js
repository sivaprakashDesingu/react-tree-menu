import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import NotificationSystem from 'react-notification-system'
//import { parse } from 'query-string'

class Toastr extends Component {

    componentWillReceiveProps(nextProps) {

        if (nextProps.AudioToTrackReducer.error.message !== this.props.AudioToTrackReducer.error.message) {
            // this
            //     .refs
            //     .toastr
            //     .addNotification({ title: 'Error', message: nextProps.AudioToTrackReducer.error.message, level: 'error', autoDismiss: 4 })
        }

        if (nextProps.AudioToTrackReducer.success.message !== this.props.AudioToTrackReducer.success.message && nextProps.AudioToTrackReducer.success.message !== '') {

            this
                .refs
                .toastr
                .addNotification({ title: 'Success', message: nextProps.AudioToTrackReducer.success.message, level: 'success', autoDismiss: 4 })
        }
        // if (nextProps.userLogin.error.message !== this.props.userLogin.error.message
        //     && nextProps.userLogin.error.message !== '') {
        //     this
        //         .refs
        //         .toastr
        //         .addNotification({ title: 'Error', message: nextProps.userLogin.error.message, level: 'error', autoDismiss: 4 })
        // }
        //console.log(this.props.userLogin.success)
        if (nextProps.userLogin.success.message !== this.props.userLogin.success.message
            && nextProps.userLogin.success.message !== '') {

            this
                .refs
                .toastr
                .addNotification({ title: 'Success', message: nextProps.userLogin.success.message, level: 'success', autoDismiss: 4 })
        }
        if (nextProps.UserManagement.success.message !== this.props.UserManagement.success.message
            && nextProps.UserManagement.success.message !== '') {
            this
                .refs
                .toastr
                .addNotification({ title: 'Success', message: nextProps.UserManagement.success.message, level: 'success', autoDismiss: 4 })
        }
        if (nextProps.UserManagement.error.message !== this.props.UserManagement.error.message
            && nextProps.UserManagement.error.message !== '') {
            this
                .refs
                .toastr
                .addNotification({ title: 'Error', message: nextProps.UserManagement.error.message, level: 'error', autoDismiss: 4 })
        }
        if (nextProps.QAManagement.success.message !== this.props.QAManagement.success.message
            && nextProps.QAManagement.success.message !== '') {
            this
                .refs
                .toastr
                .addNotification({ title: 'Success', message: nextProps.QAManagement.success.message, level: 'success', autoDismiss: 4 })
        }
        if (nextProps.QAManagement.error.message !== this.props.QAManagement.error.message
            && nextProps.QAManagement.error.message !== '') {
            this
                .refs
                .toastr
                .addNotification({ title: 'Error', message: nextProps.QAManagement.error.message, level: 'error', autoDismiss: 4 })
        }

        if (nextProps.SuperAdminReducer.success.message !== this.props.SuperAdminReducer.success.message
            && nextProps.SuperAdminReducer.success.message !== '') {
            this
                .refs
                .toastr
                .addNotification({ title: 'Success', message: nextProps.SuperAdminReducer.success.message, level: 'success', autoDismiss: 4 })
        }

        if (nextProps.SuperAdminReducer.error.message !== this.props.SuperAdminReducer.error.message
            && nextProps.SuperAdminReducer.error.message !== '') {
            this
                .refs
                .toastr
                .addNotification({ title: 'Error', message: nextProps.SuperAdminReducer.error.message, level: 'error', autoDismiss: 4 })
        }

    }

    render() {
        return <NotificationSystem ref='toastr' />
    }
}

const mapStateToProps = (state) => {
    const { AudioToTrackReducer, userLogin, UserManagement,QAManagement,SuperAdminReducer } = state
    return {
        AudioToTrackReducer,
        userLogin,
        UserManagement,
        QAManagement,
        SuperAdminReducer
    }
}

export default withRouter(connect(mapStateToProps, {

})(Toastr))
