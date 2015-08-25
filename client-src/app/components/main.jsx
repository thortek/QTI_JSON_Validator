/** In this file, we create a React component which incorporates components provided by material-ui */

let React = require('react');
let mui = require('material-ui');
let RaisedButton = mui.RaisedButton;
let TextField = mui.TextField;
let Dialog = mui.Dialog;
let ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors;

let FileForm = require('./fileform.jsx');

let Main = React.createClass({

  getInitialState() {
    return {
      commits: 0,
      errorText: "The uploaded file must be .json",
      isJson: false
    };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillMount() {
    ThemeManager.setPalette({
      accent1Color: Colors.deepOrange500
    });
  },

  render() {

    let containerStyle = {
      textAlign: 'center',
      paddingTop: '200px'
    };

    let textStyle = {
      width: '400px'
    };

    let standardActions = [
      { text: 'Okay' }
    ];

    return (
      <div style={containerStyle}>
        <Dialog
          title="JSON validator progress"
          actions={standardActions}
          ref="validationDialog">
          Your JSON file has been converted to XML and is being validated by the IMS validators at http://validator.imsglobal.org/
        </Dialog>

        <h1>Validate QTI JSON</h1>
        {/*<FileForm/>*/}
        <form action="/validator/upload" method="post" encType="multipart/form-data">
          <TextField type="file" name="fileToValidate" style={textStyle}
        errorText={this.state.errorText}
        errorStyle={{color:'orange'}}
        onChange={this._handleErrorInputChange}
        defaultValue="Custom error color" />
          <br/>
          <RaisedButton label="Submit" type="Submit" primary={true}
            disabled={!this.state.isJson}/>
        </form>
      </div>
    );
  },

  _handleErrorInputChange(e) {
    let value = e.target.value;
    let extJson = value.substr(value.length - 4) === 'json';
    this.setState({
      isJson: extJson,
      errorText: extJson ? '' : 'The file extension must be json.'
    });
  }

});

module.exports = Main;
