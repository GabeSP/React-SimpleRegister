import React, { Component } from 'react';
import $ from 'jquery';
import CustomInput from './components/CustomInput';
import CustomButton from './components/CustomButton';
import PubSub from 'pubsub-js';
import ManageError from './ManageError';
import AuthAdmin from './Auth';

class BookForm extends Component {

    constructor() {
        
        super();
        this.state = {title:'', price:''};
        this.sendForm = this.sendForm.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.setPrice = this.setPrice.bind(this);

    }

    sendForm(event) {

        event.preventDefault();
        $.ajax({
            url: '',
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify({title:this.state.title, price:this.state.price }),
            success: function (newList) {
                PubSub.publish('update-book-list', newList);
                this.setState({title:'', price:''});
              }.bind(this),
              error: function (answer) { 
                  if(answer.status === 400) {
                      new ManageError().publishError(answer.responseJSON);
                  }
               },
               beforeSend: function() {
                   PubSub.publish('clean-error', {});
               }
        });
    }

    setTitle(event) {

        this.setTitle({title:event.target.value});
    }

    setPrice(event) {

        this.setPrice({price:event.target.value});
    }

    render() {

        return (
            <div className='pure-form'>
                <form className='pure-form pure-form-aligned form-custom' onSubmit={this.sendForm} method='POST'>
                    <CustomInput id='title' type='text' name='title' value={this.state.title} onChage={this.setTitle} label="Title" />
                    <CustomInput id='price' type='text' name='price' value={this.state.price} onChage={this.setPrice} label="Price" />
                    <CustomButton label='save'/>
                </form>
            </div>
        );
    }
}

class BookTable extends Component {

    render() {
        
        return(

            <div>
                <table className='pure-table table-custom'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.list.map(book => (
                            <tr key={book.id}>
                                <td>{book.title}</td>
                                <td>{book.auth}</td>
                                <td>{book.price}</td>
                            </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default class BookAdmin extends Component {

    constructor() {
        
        super();
        this.state = {list : []};
    }

    componentDidMount() {
        $.ajax({
            type: 'GET',
            url: 'http://www.mocky.io/v2/5b3e94eb3000005000abc73b',
            dataType: 'json',
            success:function(answer) {
                this.setState({list:answer});
              }.bind(this)
        });

        PubSub.subscribe('update-book-list', function (topic, newList) { 

            this.setState({list:newList});
         }.bind(this));
    }

    render() {

        return(
            <div>
                <div className='header'>
                    <h1>Register a new Book</h1>
                </div>
                <div className='content' id='content'>
                    <BookForm/>
                    <BookTable list={this.state.list}/>
                </div>
            </div>
        );
    }
}