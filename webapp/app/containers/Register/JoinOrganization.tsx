import * as React from 'react'
import { compose } from 'redux'
import injectReducer from '../../utils/injectReducer'
import injectSaga from '../../utils/injectSaga'
import reducer from '../App/reducer'
import saga from '../App/sagas'

import {connect} from 'react-redux'
import {active} from '../App/actions'
import {createStructuredSelector} from 'reselect'
import {makeSelectSignupLoading} from './selectors'
import {InjectedRouter} from 'react-router/lib/Router'
const Spin = require('antd/lib/spin')
const styles = require('./register.less')


interface IJoinOrganizationProps {
  onActiveUser: (token: string, resolve: (err?: string) => any) => any
  router: InjectedRouter
}

export class JoinOrganization extends React.PureComponent <IJoinOrganizationProps, {}> {
  private activeUser  = () => {
    const { onActiveUser } = this.props
    const token = this.getParamsByLocation('token')
    onActiveUser(token, (res) => {
      const path = `${window.location.protocol}//${window.location.host}/#projects`
      location.replace(path)
    })
  }

  private isEmptyOrNull = (str) => str == null || str === undefined || str === '' || str === 'null' || typeof str === 'undefined'

  private getParamsByLocation = (name) => {
    let values = decodeURIComponent((window.location.search.match(RegExp(`[?|&|/]${name}=([^\\&|?&]+)`)) || [void 0, null])[1])
    if (this.isEmptyOrNull(values)) {
      values = decodeURIComponent((window.location.hash.match(RegExp(`[?|&|/]${name}=([^\&|?&]+)`)) || [void 0, null])[1])
    }
    return this.isEmptyOrNull(values) || values === 'null' ? '' : values
  }

  public componentWillMount () {
    this.activeUser()
  }

  public render () {
    return (
      <div className={styles.joinOrganizationWrapper}>
        <Spin size="large"/>
      </div>
    )
  }
}


const mapStateToProps = createStructuredSelector({
  activeLoading: makeSelectSignupLoading()
})

export function mapDispatchToProps (dispatch) {
  return {
    onActiveUser: (token, resolve) => dispatch(active(token, resolve))
  }
}

const withConnect = connect<{}, {}, IJoinOrganizationProps>(mapStateToProps, mapDispatchToProps)
const withReducer = injectReducer({ key: 'global', reducer })
const withSaga = injectSaga({ key: 'global', saga })

export default compose(
  withReducer,
  withSaga,
  withConnect
)(JoinOrganization)



