/*global jQuery, Handlebars, Router */
jQuery(function ($) {
  'use strict';

  Handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });
/**
 * the enter and escape keys have numbers that represent them when they are triggered as a keyboard event. Can be found using event.which. Defined here to save looking them up again.
 */
  var ENTER_KEY = 13;
  var ESCAPE_KEY = 27;

  /**
   * The Util object has 3 methods on it
   * 1. uuid - returns a 32 char random hex string
   * 2. pluralize - returns the word as singular or plural
   * 3. store - localStorage getter and setter
   */
  var util = {
    // used to identify each todo item as unique
    uuid: function () {
      /*jshint bitwise:false */
      var i, random;
      var uuid = '';

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
      }

      return uuid;
    },
    // singular or plural based on count
    pluralize: function (count, word) {
      return count === 1 ? word : word + 's';
    },
    // can be called with one or two args to get or set
    store: function (namespace, data) {
      if (arguments.length > 1) {
        return localStorage.setItem(namespace, JSON.stringify(data));
      } else {
        var store = localStorage.getItem(namespace);
        return (store && JSON.parse(store)) || [];
      }
    }
  };

  var App = {
    init: function () {
      this.todos = util.store('todos-jquery');
      this.todoTemplate = Handlebars.compile($('#todo-template').html());
      this.footerTemplate = Handlebars.compile($('#footer-template').html());
      this.bindEvents();

      /**
       * Routing uses director.js
       * :filter allows you to turn that word into a variable
       */
      new Router({
        '/:filter': function (filter) {
          this.filter = filter;
          this.render();
        }.bind(this)
      }).init('/all');
    },
    // set the this reference to App rather than the element
    // jQuery by default sets this to the element selected
    bindEvents: function () {
      $('#new-todo').on('keyup', this.create.bind(this));
      $('#toggle-all').on('change', this.toggleAll.bind(this));
      $('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
      $('#todo-list')
        .on('change', '.toggle', this.toggle.bind(this))
        .on('dblclick', 'label', this.edit.bind(this))
        .on('keyup', '.edit', this.editKeyup.bind(this))
        .on('focusout', '.edit', this.update.bind(this))
        .on('click', '.destroy', this.destroy.bind(this));
    },
    // uses Handlebar template to create html layout
    render: function () {
      var todos = this.getFilteredTodos();
      $('#todo-list').html(this.todoTemplate(todos));
      $('#main').toggle(todos.length > 0);
      $('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
      this.renderFooter();
      $('#new-todo').focus();
      util.store('todos-jquery', this.todos);
    },
    renderFooter: function () {
      var todoCount = this.todos.length;
      var activeTodoCount = this.getActiveTodos().length;
      var template = this.footerTemplate({
        activeTodoCount: activeTodoCount,
        activeTodoWord: util.pluralize(activeTodoCount, 'item'),
        completedTodos: todoCount - activeTodoCount,
        filter: this.filter
      });

      $('#footer').toggle(todoCount > 0).html(template);
    },
    toggleAll: function (e) {
      var isChecked = $(e.target).prop('checked');

      this.todos.forEach(function (todo) {
        todo.completed = isChecked;
      });

      this.render();
    },
    // uses filter higher order function
    // filter is an Array method
    // which returns not completed todo items
    // each todo has a completed property
    getActiveTodos: function () {
      return this.todos.filter(function (todo) {
        return !todo.completed;
      });
    },
    // as above but returns completed
    getCompletedTodos: function () {
      return this.todos.filter(function (todo) {
        return todo.completed;
      });
    },
    // the filter property is being checked
    // it's a property on the director.js object
    getFilteredTodos: function () {
      if (this.filter === 'active') {
        return this.getActiveTodos();
      }

      if (this.filter === 'completed') {
        return this.getCompletedTodos();
      }

      return this.todos;
    },
    // set the todos array with the active ones
    // set url to 'all'
    // display the updated data with render
    destroyCompleted: function () {
      this.todos = this.getActiveTodos();
      this.filter = 'all';
      this.render();
    },
    // accepts an element from inside the `.item` div and
    // returns the corresponding index in the `todos` array
    indexFromEl: function (el) {
      var id = $(el).closest('li').data('id');
      var todos = this.todos;
      var i = todos.length;

      while (i--) {
        if (todos[i].id === id) {
          return i;
        }
      }
    },
    create: function (e) {
      var $input = $(e.target);//$ is a convention for jquery var
      var val = $input.val().trim(); //remove whitespace

      if (e.which !== ENTER_KEY || !val) {
        return;
      }

      // use push method to add the new todo
      // to the todos array
      // 3 properties - id, title, completed
      this.todos.push({
        id: util.uuid(),
        title: val,
        completed: false // initialised to false
      });

      $input.val('');//reset the value (text) to empty

      this.render();
    },
    toggle: function (e) {
      var i = this.indexFromEl(e.target);
      this.todos[i].completed = !this.todos[i].completed;
      this.render();
    },
    edit: function (e) {
      var $input = $(e.target).closest('li').addClass('editing').find('.edit');
      $input.val($input.val()).focus();
    },
    editKeyup: function (e) {
      // the which property of the event tells which key was pressed
      if (e.which === ENTER_KEY) {
        // blur is the opposite of focus
        e.target.blur();
      }

      if (e.which === ESCAPE_KEY) {
        $(e.target).data('abort', true).blur();
      }
    },
    update: function (e) {
      var el = e.target;
      var $el = $(el);
      var val = $el.val().trim();

      if (!val) {
        this.destroy(e);
        return;
      }

      if ($el.data('abort')) {
        $el.data('abort', false);
      } else {
        this.todos[this.indexFromEl(el)].title = val;
      }

      this.render();
    },
    destroy: function (e) {
      this.todos.splice(this.indexFromEl(e.target), 1);
      this.render();
    }
  };

  App.init();
});
