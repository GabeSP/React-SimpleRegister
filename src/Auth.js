import React, { Component } from 'react';
import $ from 'jquery';
import CustomInput from './components/CustomInput';
import CustomButton from './components/CustomButton';
import PubSub from 'pubsub-js';
import ManageError from './ManageError';

class AuthForm extends Component {

    constructor() {

        super();
        this.state = {name:'', email:'', password:''};
        this.sendForm = this.sendForm.bind(this);
        this.setName = this.setName.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
    }

    sendForm(event) {

      event.preventDefault();
      $.ajax({
        url:'http://www.mocky.io/v2/5b3e2d4d3000006400abc5f0',
        contentType: 'application/json',
        dataType: 'json',
        type: 'post',
        data: JSON.stringify({name:this.state.name, email:this.state.email, password:this.state.password}),
        success: function(newList) {
          PubSub.publish('update-auth-list', newList);
          this.setState({name:'', email:'', password:''});
        }.bind(this),
        error: function(answer) {
          if(answer.status === 400) {
            new ManageError().publishError(answer.responseJSON);
          }
        },
        beforeSend: function() {
          PubSub.publish('clean-error', {});
        }
      });
    }

    setName(event) {

        this.setState({name:event.target.value});
    }

    setEmail(event) {

        this.setState({email:event.target.value});
    }

    setPassword(event) {

        this.setState({password:event.target.value});
    }

    render() {
        
        return (
          <div className='pure-form'>
            <form className="pure-form pure-form-aligned form-custom" onSubmit={this.sendForm} method="POST" >
              <CustomInput id="name" type="text" name="name" value={this.state.name} onChange={this.setName} label="Name" />
              <CustomInput id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email" />
              <CustomInput id="password" type="password" name="password" value={this.state.password} onChange={this.setPassword} label="Password" />
              <CustomButton label="Save" />
            </form>
          </div>
        );
    }
}

class AuthTable extends Component {

  render() {

    return(

      <div>
      <table className="pure-table table-custom">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.list.map(auth => (
              <tr key={auth.id}>
                <td>{auth.name}</td>
                <td>{auth.email}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
    );
  }
}

export default class AuthAdmin extends Component {
  
  constructor() {

    super();
    this.state = {list : []};
  }

  componentDidMount(){
    $.ajax({
        type: 'GET',
        url:'http://www.mocky.io/v2/5b3e2cd23000003a06abc5eb',
        dataType: 'json',
        success:function(answer) {
          this.setState({list:answer});
        }.bind(this)
      }
    );

    PubSub.subscribe('update-auth-list', function(topic, newList){

      this.setState({list:newList});
    }.bind(this));
  }

  render() {

    return (
      <div>
        <div className='header'>
          <h1>Register a new Author</h1>
        </div>
        <div className='content' id='content'>
          <AuthForm/>
          <AuthTable list={this.state.list}/>
        </div>
      </div>
    );
  }
}