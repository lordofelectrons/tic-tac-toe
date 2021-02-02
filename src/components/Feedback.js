import React from 'react';
import './css/index.css';

class Feedback extends React.Component {
    constructor() {
        super();
        this.state = {
            Name: '',
            Organization: '',
            Type: '',
            Message: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
    }

    handleChange(event) {
        const {name, value, type} = event.target;
        type !== "file" && this.setState({[ name]: value})
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        fetch('http://localhost:8082/feedback', { method: 'POST', body: data}).then(this.setState({Name: "", Organization: "",
          Type: "Partnership", Message: ""})).then(document.getElementById("feedback_form").reset())
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} enctype="multipart/form-data" id="feedback_form" /*action='/contacts'*/>
                <input type="text" placeholder="Name" name="Name" id="inname" value={this.state.Name} onChange={this.handleChange} required/>
                <input type="text" placeholder="Organization" name="Organization" id="inorg" value={this.state.Organization} onChange={this.handleChange}/>
                <select required id="TOT" value={this.state.Type} onChange={this.handleChange} name="Type">
                    <option value="Partnership">Partnership</option>
                    <option value="Press">Press</option>
                    <option value="Other">Other</option>
                </select>
                <textarea required value={this.state.text} placeholder="Message" id="inmessage" name="Message" onChange={this.handleChange}/>
                <input required id="pic" type="file" name="Picture" ref={this.fileInput} accept="image/*"/>
                <input id="sendbut" type="submit" value="Send Message" formmethod="POST" />
            </form>
        )
    }
}
export default Feedback;
