// this creates a React component that can be used in other components or
// used directly on the page with React.renderComponent

let React = require('react');
let mui = require('material-ui');
let RaisedButton = mui.RaisedButton;
let TextField = mui.TextField;

let FileForm = React.createClass({

  // since we are starting off without any data, there is no initial value
  getInitialState() {
    return {
      data_uri: null,
    };
  },

  // prevent form from submitting; we are going to capture the file contents
  handleSubmit(e) {
    e.preventDefault();
  },

  // when a file is passed to the input field, retrieve the contents as a
  // base64-encoded data URI and save it to the component's state
  handleFile(e) {
    let self = this;
    let reader = new FileReader();
    let file = e.target.files[0];
    console.log(e.target.data);

    reader.onload = function(upload) {
      console.log(upload.target.result);
      self.setState({
        data_uri: upload.target.result,
      });

    }

    reader.readAsDataURL(file);
  },

  // return the structure to display and bind the onChange, onSubmit handlers
  render() {
    // since JSX is case sensitive, be sure to use 'encType'
    return (
      <form onSubmit={this.handleSubmit} encType="multipart/form-data">
        <TextField type="file" onChange={this.handleFile} />
      </form>
    );
  },
});

module.exports = FileForm;
