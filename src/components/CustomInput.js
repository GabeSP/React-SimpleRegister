import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class CustomInput extends Component {

  constructor() {

    super();
    this.state = {msgError:''};
  }

  render() {
    return (
      <div className="pure-control-group">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input {...this.props} required/>  
        <span className='error'>{this.state.msgError}</span>
      </div>
    );
  }

  componentWillMount() {
    
    PubSub.subscribe('valid-error', function (topic, error) {
      if(error.field === this.props.name) {
        this.setState({msgError:error.defaultMessage});
        }
      }.bind(this));

    PubSub.subscribe('clean-error', function (topic) {
      this.setState({msgError: ''});
      }.bind(this));

  }
}