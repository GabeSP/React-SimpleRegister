import React, { Component } from 'react';
import $ from 'jquery';
import CustomInput from './components/CustomInput';
import CustomButton from './components/CustomButton';
import PubSub from 'pubsub-js';
import ManageError from './ManageError';

class BookForm extends Component {

    constructor() {
        
        super();
        this.state = {title:'', author:'', price:''};
        this.sendForm = this.sendForm.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.setAuthorId = this.setAuthorId.bind(this);
        this.setPrice = this.setPrice.bind(this);

    }

    sendForm(event) {

        event.preventDefault();
        $.ajax({
            url: 'http://www.mocky.io/v2/5b3f6b2f3400005b02001acb',
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify({title:this.state.title, author:this.state.authorId, price:this.state.price }),
            success: function (newList) {
                PubSub.publish('update-book-list', newList);
                this.setState({title:'', authorId:'', price:''});
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

        this.setState({title:event.target.value});
    }
    setAuthorId(event) {

        this.setState({authorId:event.target.value});
    }
    setPrice(event) {

        this.setState({price:event.target.value});
    }

    render() {

        return (
            <div className='pure-form'>
                <form className='pure-form pure-form-aligned form-custom' onSubmit={this.sendForm} method='POST'>
                    <CustomInput id='title' type='text' name='title' value={this.state.title} onChange={this.setTitle} label="Title" />
                    <CustomInput id='price' type='text' name='price' value={this.state.price} onChange={this.setPrice} label="Price" />
                    <div className="pure-control-group">
                        <label htmlFor="authorId">Author</label>
                        <select value={this.state.authorId} name="authorId" id="authorId" onchange={this.setAuthorId}>
                            <option value="">Select an Author</option>
                            {
                                this.props.authors.map(author => (
                                    <option value={author.id}>{author.name}</option>
                                ))
                            }
                        </select>
                    </div>
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
                                <td>{book.author}</td>
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
        this.state = {list : [], authors : []};
    }

    componentDidMount() {
        $.ajax({
            type: 'GET',
            url: 'http://www.mocky.io/v2/5b3f69f63400006400001ac4',
            dataType: 'json',
            success:function(answer) {
                this.setState({list:answer});
              }.bind(this)
        });

        $.ajax({
            type: 'GET',
            url:'http://www.mocky.io/v2/5b3f6a5d3400005a00001ac7',
            dataType: 'json',
            success:function(answer) {
                this.setState({authors:answer});
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
                    <BookForm authors={this.state.authors}/>
                    <BookTable list={this.state.list}/>
                </div>
            </div>
        );
    }
}