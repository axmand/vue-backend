/// <reference path="../../../vendor/d3/d3.min.js" />

/**
* 工具服务
*/
define(['baseServices', 'jquery', 'd3'], function (baseServices, $, d3) {

    /**
    *   基于d3v3的树形视图
    *   @example
    */
    baseServices.factory('$$tree', function () {
        //可拖拽编辑模式
        var _draggable = false;
        //总节点数，最大标题长度
        var totalNodes = 0, maxLabelLength = 5;//最大结点label名称长度
        //树形layout
        var tree;
        //
        var _selectNodeFn, _changeFatherFn;
        //
        var baseSvg, svgGroup;
        //
        var viewerWidth, viewerHeight, domNode;//svg dom node节点
        //
        var visit = function (parent) {
            if (!parent || parent.count === 0)
                return;
            for (var count = 0, length = parent.children.length; count < length; count++) {
                totalNodes++;
                //探索children节点
                visitElement(parent.children[count]);
            }
        };
        //
        var visitElement = function (element) {
            if (!!element.children)
                for (var count = 0, length = element.children; count < length; count++) {
                    totalNodes++;
                    visitElement(element.children[count]);
                }
        };
        //
        var selectedNode = null;
        var draggingNode = null;//正在移动的节点（每次 mousedown后设置）
        var panSpeed = 200; // 移动结点速度
        var panBoundary = 20; // Within 20px from edges will pan when dragging.
        var i = 0;
        var duration = 750;
        var root;
        //坐标转换（projection）
        var diagonal = d3.svg.diagonal().projection(function (d) {
            return [d.y, d.x];
        });
        //文字排序
        var sortTree = function () {
            tree.sort(function (a, b) {
                return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
            });
        };
        //核心方法-平移
        var pan = function (domNode, direction) {
            var speed = panSpeed;
            if (panTimer) {
                clearTimeout(panTimer);
                translateCoords = d3.transform(svgGroup.attr("transform"));
                if (direction == 'left' || direction == 'right') {
                    translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                    translateY = translateCoords.translate[1];
                } else if (direction == 'up' || direction == 'down') {
                    translateX = translateCoords.translate[0];
                    translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
                }
                scaleX = translateCoords.scale[0];
                scaleY = translateCoords.scale[1];
                scale = zoomListener.scale();
                svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
                d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
                zoomListener.scale(zoomListener.scale());
                zoomListener.translate([translateX, translateY]);
                panTimer = setTimeout(function () {
                    pan(domNode, speed, direction);
                }, 50);
            }
        }
        //核心方法-缩放
        var zoom = function () {
            svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }
        //zoom事件注册
        var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);
        //高亮显示选中的节点
        var highLightNode = function () {
            if (domNode != null)
                d3.select(domNode).select('.nodeCircle').attr('style', 'fill: rgb(124, 255, 255);');
        }
        //复原node颜色
        var recoverNode = function () {
            if (domNode != null)
                d3.select(domNode).select('.nodeCircle').attr('style', 'fill: rgb(255, 255, 255);');
        }
        //mousedown后 构建可移动节点
        var initiateDrag = function (d, domNode) {
            draggingNode = d;
            d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
            d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
            d3.select(domNode).attr('class', 'node activeDrag');
            svgGroup.selectAll("g.node").sort(function (a, b) { // select the parent and sort the path's
                if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
                else return -1; // a is the hovered element, bring "a" to the front
            });
            // if nodes has children, remove the links and nodes
            if (nodes.length > 1) {
                // remove link paths
                links = tree.links(nodes);
                nodePaths = svgGroup.selectAll("path.link")
                    .data(links, function (d) {
                        return d.target.id;
                    }).remove();
                // remove child nodes
                nodesExit = svgGroup.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id;
                    }).filter(function (d, i) {
                        if (d.id == draggingNode.id) {
                            return false;
                        }
                        return true;
                    }).remove();
            }
            // remove parent link
            parentLink = tree.links(tree.nodes(draggingNode.parent));
            svgGroup.selectAll('path.link').filter(function (d, i) {
                if (d.target.id == draggingNode.id) {
                    return true;
                }
                return false;
            }).remove();
            dragStarted = null;
        }
        //drag事件注册
        var dragListener = d3.behavior.drag()
                .on("dragstart", function (d) {
                    if (d == root) return;
                    dragStarted = true;
                    //复原node
                    recoverNode();
                    domNode = this;
                    highLightNode();
                    nodes = tree.nodes(d);
                    _selectNodeFn(d);
                    d3.event.sourceEvent.stopPropagation();
                    // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
                })
                .on("drag", function (d) {
                    if (!_draggable) return;
                    if (d == root) return;
                    if (dragStarted) {
                        domNode = this;
                        initiateDrag(d, domNode);
                    }
                    // get coords of mouseEvent relative to svg container to allow for panning
                    relCoords = d3.mouse($('svg').get(0));
                    if (relCoords[0] < panBoundary) {
                        panTimer = true;
                        pan(this, 'left');
                    } else if (relCoords[0] > ($('svg').width() - panBoundary)) {
                        panTimer = true;
                        pan(this, 'right');
                    } else if (relCoords[1] < panBoundary) {
                        panTimer = true;
                        pan(this, 'up');
                    } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                        panTimer = true;
                        pan(this, 'down');
                    } else {
                        try {
                            clearTimeout(panTimer);
                        }
                        catch (e) {
                        }
                    }
                    d.x0 += d3.event.dy;
                    d.y0 += d3.event.dx;
                    var node = d3.select(this);
                    node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
                    updateTempConnector();
                })
                .on("dragend", function (d) {
                    if (!_draggable) return;
                    if (d == root) return;
                    domNode = this;
                    if (!!selectedNode) {
                        var index = draggingNode.parent.children.indexOf(draggingNode);
                        if (index > -1) {
                            draggingNode.parent.children.splice(index, 1);
                        }
                        if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                            if (typeof selectedNode.children !== 'undefined') {
                                selectedNode.children.push(draggingNode);
                            } else {
                                selectedNode._children.push(draggingNode);
                            }
                        } else {
                            selectedNode.children = [];
                            selectedNode.children.push(draggingNode);
                        }
                        //修改父节点
                        //展开结点以及字节点
                        expand(selectedNode);
                        sortTree();
                    }
                    endDrag();
                });
        //
        var collapse = function (d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }
        //
        var expand = function (d) {
            if (d._children) {
                d.children = d._children;
                d.children.forEach(expand);
                d._children = null;
            }
        }
        //
        var overCircle = function (d) {
            selectedNode = d;
            updateTempConnector();
        };
        //
        var outCircle = function (d) {
            selectedNode = null;
            updateTempConnector();
        };
        //重绘连接线
        var updateTempConnector = function () {
            var data = [];
            if (draggingNode !== null && selectedNode !== null) {
                // have to flip the source coordinates since we did this for the existing connectors on the original tree
                data = [{
                    source: {
                        x: selectedNode.y0,
                        y: selectedNode.x0
                    },
                    target: {
                        x: draggingNode.y0,
                        y: draggingNode.x0
                    }
                }];
            }
            //
            var link = svgGroup.selectAll(".templink").data(data);
            //
            link.enter().append("path")
                .attr("class", "templink")
                .attr("d", d3.svg.diagonal())
                .attr('pointer-events', 'none');
            link.attr("d", d3.svg.diagonal());
            link.exit().remove();
        };
        //拖拽完成 
        var endDrag = function () {
            selectedNode = null;
            d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
            d3.select(domNode).attr('class', 'node');
            // now restore the mouseover event or we won't be able to drag a 2nd time
            d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
            updateTempConnector();
            if (draggingNode !== null) {
                update(root);
                centerNode(draggingNode);
                draggingNode = null;
            }
        };
        //置中
        var centerNode = function (source) {
            scale = zoomListener.scale();
            x = -source.y0;
            y = -source.x0;
            x = x * scale + viewerWidth / 2;
            y = y * scale + viewerHeight / 2;
            d3.select('g').transition()
                .duration(duration)
                .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
            zoomListener.scale(scale);
            zoomListener.translate([x, y]);
        }
        //toggle（展开/收拢子节点）
        var toggleChildren = function (d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else if (d._children) {
                d.children = d._children;
                d._children = null;
            }
            return d;
        }
        //点击节点
        var click = function (d) {
            if (d3.event.defaultPrevented) return; // click suppressed
            d = toggleChildren(d);
            update(d);
            centerNode(d);
            //选中node回调
            _selectNodeFn(d);
        }
        //重绘
        var update = function (source) {
            var levelWidth = [1];
            var childCount = function (level, n) {
                if (n.children && n.children.length > 0) {
                    if (levelWidth.length <= level + 1) levelWidth.push(0);
                    levelWidth[level + 1] += n.children.length;
                    n.children.forEach(function (d) {
                        childCount(level + 1, d);
                    });
                }
            };
            childCount(0, root);
            var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line  
            tree = tree.size([newHeight, viewerWidth]);
            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);
            // Set widths between levels based on maxLabelLength.
            nodes.forEach(function (d) {
                d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
                // alternatively to keep a fixed scale one can set a fixed depth per level
                // Normalize for fixed-depth by commenting out below line
                // d.y = (d.depth * 500); //500px per level.
            });
            // Update the nodes…
            node = svgGroup.selectAll("g.node")
                .data(nodes, function (d) {
                    return d.id || (d.id = ++i);
                });
            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .call(dragListener)
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on('click', function (d) {

                    click(d);
                });

            nodeEnter.append("circle")
                .attr('class', 'nodeCircle')
                .attr("r", 0)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeEnter.append("text")
                .attr("x", function (d) {
                    return d.children || d._children ? -10 : 10;
                })
                .attr("dy", ".35em")
                .attr('class', 'nodeText')
                .attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function (d) {
                    return d.name;
                })
                .style("fill-opacity", 0);

            // phantom node to give us mouseover in a radius around it
            nodeEnter.append("circle")
                .attr('class', 'ghostCircle')
                .attr("r", 30)
                .attr("opacity", 0.2)
                .style("fill", "red")
                .attr('pointer-events', 'mouseover')
                .on("mouseover", function (node) {
                    overCircle(node);
                })
                .on("mouseout", function (node) {
                    outCircle(node);
                });

            // Update the text to reflect whether node has children or not.
            node.select('text')
                .attr("x", function (d) {
                    return d.children || d._children ? -10 : 10;
                })
                .attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function (d) {
                    return d.name;
                });

            // Change the circle fill depending on whether it has children and is collapsed
            node.select("circle.nodeCircle")
                .attr("r", 4.5)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            // Fade the text in
            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 0);

            nodeExit.select("text")
                .style("fill-opacity", 0);

            // Update the links…
            var link = svgGroup.selectAll("path.link")
                .data(links, function (d) {
                    return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function (d) {
                    var o = {
                        x: source.x0,
                        y: source.y0
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function (d) {
                    var o = {
                        x: source.x,
                        y: source.y
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }
        //重置
        var _reset = function () {
            tree = null;
            totalNodes = 0;
            tree = d3.layout.tree().size([viewerHeight, viewerWidth]);
        }
        //设置绘图容器ID
        var _setContainerId = function (containerId, selectNodeFn, changeFatherFn) {
            _reset();
            _selectNodeFn = selectNodeFn || function () { };
            _changeFatherFn = changeFatherFn || function () { };
            //绘图区宽和高
            var _container = $('#' + containerId);
            viewerWidth = _container.width();
            viewerHeight = $(window).height();
            if (!!baseSvg && !!baseSvg.empty) {
                baseSvg.remove();
            }
            baseSvg = d3.select('#' + containerId).append("svg")
                .attr("width", viewerWidth)
                .attr("height", viewerHeight)
                .attr("class", "overlay")
                .call(zoomListener);
            //构建绘图区域
            if (!!svgGroup && !!svgGroup.empty) {
                svgGroup.remove();
            }
            svgGroup = baseSvg.append("g");
        }
        //更新节点
        var _updateNode = function (treeNode) {
            //清空缓存
            _reset();
            //遍历树形对象和数据
            visit(treeNode);
            sortTree();
            //
            root = treeNode;
            root.x0 = viewerHeight / 2;
            root.y0 = 0;
            //更新页面节点
            update(root);
            //置中
            centerNode(root);
        }
        //创建节点
        var _createNode = function () {

        }

        return {
            setContainerId: _setContainerId,
            updateNode: _updateNode,
            addNode: _createNode,
            draggable: _draggable,
        };

    });
});