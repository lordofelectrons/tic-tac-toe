import React from 'react';
import './css/index.css';

const altText = "It`s impossible to load this image!";

class CurUser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div id="currentUser" ref={this.props.refer}>
            <img class="avatars" src={this.props.avatar} alt={altText} hidden={!this.props.isSigned}/>
            <div>
              <font id="username">{this.props.login}</font><br/>
              <font id="userextra">{this.props.extra}</font>
            </div>
          </div>
        )
    }
}
export default CurUser;
