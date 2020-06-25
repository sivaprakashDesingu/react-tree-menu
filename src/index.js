import React from "react";
import "./../assets/style/style.scss";
const folder = [
  {
    name: "Folder1",
    id: 1,
    hasChildren: true,
    isFolder: true
  },
  {
    name: "Folder2",
    id: 2,
    hasChildren: true,
    isFolder: true
  },
  {
    name: "Folder3",
    id: 3,
    hasChildren: true,
    isFolder: true
  }
];
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderMenus() {
    folder.map((data, i) => {
      return <li className="folder-item folder">{data.name}</li>;
    });
  }
  render() {
    return (
      <div className="folder-wrapper">
        <ul>{this.renderMenus()}</ul>
      </div>
    );
  }
}
