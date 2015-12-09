var th = document.getElementById('thumbnails');

th.addEventListener('click', function(e) {
  var t = e.target, new_src = t.parentNode.href,
      large = document.getElementById('large'),
      cl = large.classList,
      lgwrap = document.getElementById('lg-wrap');
  lgwrap.style.backgroundImage = 'url(' +large.src + ')';
  if(cl) cl.add('hideme');
  window.setTimeout(function(){
    large.src = new_src;
    if(cl) cl.remove('hideme');
  }, 50);
  e.preventDefault();
}, false);

$(document).ready(function(){
  $('input[type=button]').click(function(){
    ajaxForm($(this));
  });
});
function ajaxForm(button){
  var form = button.closest('form'),
      formElements = ['input:not([type=button]):not([type=submit])', 'select', 'textarea'],
      formNames = new Array(),
      dataString = '';
  for (var i in formElements) {
    form.find(formElements[i]).each(function(){
      formNames.push([$(this).attr('name'), $(this).val()]);
    });
  }
  for (var i in formNames) {
    if (dataString!=='') {
      dataString += '&'
        }
    dataString += formNames[i][0]+'='+escape(formNames[i][1]);
  }
  $.ajax({
    type: form.attr('method'),
    url: form.attr('action'),
    data: dataString,
    success: function(){
      console.log(dataString); // Success actions go here.
    }
  });
}

if (!localStorage.getItem("updates")) {
	localStorage.setItem("updates", JSON.stringify([
    {
      id: 1876876,
      content: "This is a sample update card for this React demo."
    },
    {
      id: 54654798,
      content: "I submitted this update using CMD+Enter because power user features rock!"
    },
    {
      id: 9823742,
      content: "These cards totally fade out when they're deleted."
    }
  ]));
}

// A quick utility mixin for listening to animationend event cross-browser.
var AnimateListenMixin = {
  animateListen: function(node, callback) {
    node.addEventListener("animationend", callback);
		node.addEventListener("webkitAnimationEnd", callback);
    node.addEventListener("mozAnimationEnd", callback);
    node.addEventListener("MSAnimationEnd", callback);
  }
};

// A little component for incorporating with the Update component but can be used elsewhere.
var DeleteButton = React.createClass({
  render: function(){
    return (
    	React.DOM.span({
        className: "delete-button",
        onClick: this.props.deleteAction // the main action for this component is passed by the parent component using it
      }, "DELETE")
    );
  }
});

// The Update component that holds a paragraph of text and a delete button
var Update = React.createClass({
  displayName: "Update", // displayName is used for debugging purposes.
  render: function() {
    return (
    	React.DOM.article({
        className: "update",
        key: this.props.key,
        "data-id": this.props.id
      }, [
        React.createElement(DeleteButton, {
          deleteAction: this.props.removeUpdate
        }),
        React.DOM.p({
          className: "update-content"
        }, this.props.content)
      ])
    );
  }
});

// A list of updates, basically a container for the updates to use elsewhere.
var UpdatesList = React.createClass({
  displayName: "UpdatesList",
  mixins: [AnimateListenMixin], // mixing-in the utility function created before
  removeAnimate: function(e){ // removes the data-animate attribute once the animation is ended.
    e.target.removeAttribute("data-animate");
  },
  differ: function(x) { // utility method for use with filtering an array of props
    return this.props.updates.indexOf(x) < 0;
  },
  getDiff: function(prevProps, props) { // utility method for returning the index of the deleted property
    var deletedUpdate = prevProps.updates.filter(this.differ, props);

    return prevProps.updates.indexOf(deletedUpdate[0]);
  },
  componentDidMount: function() { // once the component is mounted, start listening for the end of the animations
		this.animateListen(this.getDOMNode(), this.removeAnimate);
  },
  componentDidUpdate: function(prevProps){ // once the component is updated, check for more or less updates in the list and take action
    var updates = this.getDOMNode().querySelectorAll(".update");
    if(updates && prevProps.updates.length < this.props.updates.length) { // new updates would fade-down from the update form
      updates.item(0).setAttribute("data-animate", "fade-down");
    } else if (updates && prevProps.updates.length > this.props.updates.length) { // after deleting an event, have all following updates fly-up in its place
      for(var i = 0; i < updates.length; i++) {
        var child = updates.item(i);
        var diffIndex = this.getDiff(prevProps, this.props);
        if(i >= diffIndex) {
          child.setAttribute("data-animate", "fly-up");
        }
      }
    }
  },
  render: function(){
    var self = this;
    return (
    	React.DOM.section({
        className: "updates-list"
      }, [
        this.props.updates.map(function(update, i){
          return React.createElement(Update, {
            content: update.content,
            key: i,
            id: update.id,
            removeUpdate: self.props.removeUpdate
          });
        })
      ])
    );
  }
});

// The update form component used for creating new updates in the app
var UpdateForm = React.createClass({
  displayName: "UpdateForm",
  getInitialState: function(){
    return {
      disabled: true
    }
  },
  handleKeyDown: function(e){ // when the CMD/Ctrl and Enter keys are pressed down, submit the udpate
    if (e.metaKey && e.keyCode === 13 && e.target.value.trim().length > 0) {
      e.target.blur();
      this.props.handleSubmit(e);
    }
  },
  handleChange: function(e){ // when the form's textarea content is changed, resize the textarea according to the scrollHeight and if there is content then enable the submit button.
    var textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.style.height < textarea.scrollHeight ? "4em" : textarea.scrollHeight + "px";

    if (textarea.value.trim().length > 0) {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({
        disabled: true
      });
    }
  },
  render: function() {
    return (
      React.DOM.form({
        className: "update-form",
        "data-animate": "fade-in"
      }, [
        React.DOM.textarea({ // this textarea could be broken out into its own component to use its functionality elsewhere in a more complex app
	        className: "update-text",
        	placeholder: "What's Up, Doc?",
          onKeyDown: this.handleKeyDown,
          onChange: this.handleChange,
          ref: "text",
          rows: "4"
	      }),
        React.DOM.input({
          className: "update-submit",
          type: "submit",
          value: "Update",
          onClick: this.props.handleSubmit,
          disabled: this.state.disabled
        })
      ])
    );
  }
});

var App = React.createClass({ // the complete App component for placing in the page onLoad, acts as a sort of controller for the child components
  displayName: "App",
  getDefaultProps: function(){
    return {
      // if no updates are passed into the app when mounted, we can set the default to the latest list from localStorage
      updates: JSON.parse(localStorage.getItem("updates"))
    };
  },
  handleSubmit: function(e){ // the submit function being passed into the update form
    e.preventDefault();
    var textarea = this.getDOMNode().querySelector('textarea');

    if (textarea.value.trim().length) {
			this.createUpdate(textarea);
    } else {
      this.tryAgain(textarea);
    }
  },
  tryAgain: function(textarea){
    textarea.value = '';
    textarea.setAttribute("placeholder", "You'll need to add content before submitting.");
    Velocity(textarea, { // using Velocity.js for little JS animations for bringing the textarea back to size.
      height: "4em"
    }, {
      duration: 300,
      easing: "easeOutQuint"
    });
    textarea.focus();
  },
  createUpdate: function(textarea) { // grabs a textarea's content, resets the area, and stores the update
    var content = textarea.value;
    this.resetText(textarea);
    this.storeUpdate(content);
  },
  storeUpdate: function(content) { // grabs the current JSON array from localStorage
    var updates = JSON.parse(localStorage.getItem("updates"));

    // use the Crypto API to get a unique id for the update
    var array = new Uint32Array(1);
		window.crypto.getRandomValues(array);

    // adds the update object to the front of the array
    updates.unshift({
      id: array[0],
      content: content
    });

    // replaces the old JSON array in localStorage
    localStorage.setItem("updates", JSON.stringify(updates));
    this.setProps({
      updates: updates
    });
  },
  removeUpdate: function(e) { // method used to remove updates from the feed and localStorage
    // first check to make sure we have the right target
    if(e.target.parentNode.classList.contains('update')) {
      e.target = e.target.parentNode;
    } else {
      return;
    }
    var self = this;
    var updates = JSON.parse(localStorage.getItem("updates"));

    // iterate over the stored updates to make a new array of object ids and finds the indexOf the object to be removed
    var pos = updates.map(function(update){
      return update.id
    }).indexOf(+e.target.getAttribute("data-id"));
    updates.splice(pos, 1);

    // store the updated array in localStorage
    localStorage.setItem("updates", JSON.stringify(updates));

    // adds the fade-out animation and queues the setProps update to be called after the duration of the animation
    e.target.setAttribute("data-animate", "fade-out");
    setTimeout(function(){
      self.setProps({
        updates: updates
      });
    }, 350);
  },
  resetText: function(textarea) {
    textarea.value = '';
    textarea.setAttribute("placeholder", "What's Up, Doc?");
    Velocity(textarea, {
      height: "4em"
    }, {
      duration: 300,
      easing: "easeOutQuint"
    });
  },
  componentDidMount: function(){ // when the app mounts fade-up every available update
    var updates = this.getDOMNode().querySelectorAll(".update");
    if (updates) {
    	for(var i = 0; i < updates.length; i++) {
        updates.item(i).setAttribute("data-animate", "fade-up");
      }
    }
  },
  render: function(){
    return (
    	React.DOM.div({
        className: "container app"
      }, [
        React.DOM.h1({
          className: "app-header"
        }, "A React Update Feed"),
        React.createElement(UpdateForm, {
          handleSubmit: this.handleSubmit
        }),
        React.createElement(UpdatesList, {
          updates: this.props.updates,
          removeUpdate: this.removeUpdate
        })
      ])
    );
  }
});


// Render the App component and attach it to the body.
React.render(React.createElement(App, null), document.body);
