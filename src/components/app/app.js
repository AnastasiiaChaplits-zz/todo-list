import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import ToDoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter'
import AddItem from '../add-item';

import './app.css';
import { renderIntoDocument } from 'react-dom/test-utils';

export default class App extends Component {

  maxId = 100;

  state = {
    todoData: [
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Make Awesome App'),
      this.createTodoItem('Have a launch')
    ],
    term: '',
    filter: 'all' 
  };

  createTodoItem(label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    }
  };

  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      const idx = todoData.findIndex((el)=>el.id===id);

      const newArray = [
        ...todoData.slice(0, idx),
        ...todoData.slice(idx + 1)
      ];

      return {
        todoData: newArray
      }
    });
  };

  addItem = (text) => {
    //genarate id
      const newItem = this.createTodoItem(text);
    //add to array
    this.setState(({todoData}) => {
      const newArray = todoData.concat(newItem);
      return {
        todoData: newArray
      }
    })
  };

  toggleProperty = (arr, id, propName) => {
    const idx = arr.findIndex((el)=>el.id===id);

      const oldItem = arr[idx];
      const newItem = {...oldItem, 
        [propName]: !oldItem[propName]};
      //2. create new array
      return [
        ...arr.slice(0, idx),
        newItem,
        ...arr.slice(idx + 1)
      ];
  };

  onToggleDone = (id) => {
    this.setState(({todoData})=> {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      }
    })
  };

  onToggleImportant = (id) => {
    this.setState(({todoData})=> {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      }
    })
  };

  onSearchChange = (term) => {
    this.setState({term});
  };

  onFilterChange = (filter) => {
    this.setState({filter});
  };

  search = (items, term) => {
    if (term.length === 0) {
      return items;
    }
    return items.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1
    })
  };

  filter = (items, filter) => {
    switch(filter) {
      case 'all': 
        return items;
      case 'active':
        return items.filter((item) => !item.done);
      case 'done': 
        return items.filter((item) => item.done);
      default:
        return items;
    }
  }

 

  render() {
    const {todoData, term, filter} = this.state

    const visibleItems = this.filter(this.search(todoData, term), filter);

    const doneCount = todoData.filter((el)=>el.done).length;
    const todoCount = todoData.length - doneCount;
    return (
      <div className = "todo-app">
        <AppHeader todo={todoCount} done={doneCount}/>
        <div className="top-panel d-flex">
         <ItemStatusFilter 
            filter={filter}
            onFilterChange={this.onFilterChange}/>
         <SearchPanel onSearchChange={this.onSearchChange}/>
        </div>
        <ToDoList 
          todos={visibleItems} 
          onDeleted={this.deleteItem}
          onToggleImportant={this.onToggleImportant}
          onToggleDone={this.onToggleDone}
          />
        <AddItem 
          onItemAdded={this.addItem}/>
      </div>
    );
  }
}
