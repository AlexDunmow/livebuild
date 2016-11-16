import React, {PropTypes, Component} from 'react';

class TreeItem extends Component{
  render() {
    return (
      <div className={'tree-view_item ' + this.props.itemClassName}>
        {this.props.arrow}
        {this.props.nodeLabel}
      </div>
    )
  }
}

export default class TreeView extends Component{
  constructor(props) {
    super(props)
    this.state = {collapsed: this.props.defaultCollapsed}
  }
  propTypes: {
    collapsed: PropTypes.bool,
    defaultCollapsed: PropTypes.bool,
    nodeLabel: PropTypes.node.isRequired,
    className: PropTypes.string,
    itemClassName: PropTypes.string,
  }

  handleClick = (...args) => {
    this.setState({collapsed: !this.state.collapsed});
    if (this.props.onClick) {
      this.props.onClick(...args);
    }
  }

  render() {
    const {
      collapsed = this.state.collapsed,
      className = '',
      itemClassName = '',
      nodeLabel,
      children,
      ...rest,
    } = this.props;

    let arrowClassName = 'tree-view_arrow';
    let containerClassName = 'tree-view_children';
    let label = this.props.openLabel;
    if (collapsed) {
      label = this.props.closedLabel || label;
      arrowClassName += ' tree-view_arrow-collapsed';
      containerClassName += ' tree-view_children-collapsed';
    }

    //         className={className + ' ' + arrowClassName}

    const arrow =
      <div
        {...rest}
        className={className + ' ' + arrowClassName}
        onClick={this.handleClick}>
        {label}
      </div>;

    return (
      <div className="tree-view">
        <TreeItem arrow={arrow} nodeLabel={nodeLabel} itemClassName={itemClassName} />
        <div className={containerClassName}>
          {collapsed ? null : children}
        </div>
      </div>
    );
  }
};