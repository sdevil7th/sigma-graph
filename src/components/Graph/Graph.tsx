import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";

import Graph from "graphology";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import {
  SigmaContainer,
  ControlsContainer,
  ZoomControl,
  FullScreenControl,
  SearchControl,
} from "@react-sigma/core";
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";
import { formattedGraphData } from "../../utils/helper";

import "@react-sigma/core/lib/react-sigma.min.css";
import Sigma from "sigma";
import { isEmpty } from "lodash";
import { Coordinates } from "sigma/types";
import { RawClusterData } from "../../utils/types";
import { initialGraphData } from "../../utils/data";

// cluster definition
interface ClusterPositionsData {
  [key: string]: { x: number; y: number }[];
}

const GraphContainer: React.FC<{}> = () => {
  const [firstInitFlag, setFirstInitFlag] = useState<boolean>(true);
  const graph = Graph.from(formattedGraphData as any);
  const [sigma, setSigma] = useState<Sigma | null>(null);

  const contextMenuRef: RefObject<HTMLDivElement> = useRef(null);
  const [contextMenuContent, setContextMenuContent] = useState<string>("");

  const [clusterPositions, setClusterPositions] =
    useState<ClusterPositionsData>({});

  const clusters: { [key: string]: RawClusterData } = useMemo(() => {
    const newClusters: { [key: string]: RawClusterData } = {};
    initialGraphData.clusters.forEach((cluster) => {
      newClusters[cluster.key] = cluster;
    });
    return newClusters;
  }, [initialGraphData]);

  const onNodeRightClick = (node: string, event: any) => {
    setContextMenuContent(node);
    if (contextMenuRef && contextMenuRef.current) {
      console.log(event);
      contextMenuRef.current.style.left = event.x + "px";
      contextMenuRef.current.style.top = event.y + "px";
      contextMenuRef.current.style.display = "block";
      // Add a click listener to hide the context menu on click outside
      document.addEventListener("click", hideContextMenu);
    }
  };

  const hideContextMenu = () => {
    if (contextMenuRef && contextMenuRef.current) {
      contextMenuRef.current.style.display = "none";
      document.removeEventListener("click", hideContextMenu);
    }
  };

  const initEventListeners = () => {
    if (sigma) {
      sigma?.addListener("rightClickNode", function (event) {
        event.event.original.preventDefault();
        event.preventSigmaDefault();
        onNodeRightClick(event.node, event.event);
      });
    }
  };

  const initClusters = () => {
    if (sigma) {
      // create the clustersLabel layer
      const clustersLayer = document.createElement("div");
      clustersLayer.id = "clustersLayer";
      sigma.on("afterRender", () => {
        let clusterLabelsDoms = "";
        // insert the layer underneath the hovers layer
        sigma
          .getContainer()
          .insertBefore(
            clustersLayer,
            document.getElementsByClassName("sigma-hovers")[0]
          );
        Object.keys(clusters).forEach((clusterTagName: string) => {
          // for each cluster create a div label
          const cluster = clusters[clusterTagName];
          const clusterPos = {
            x:
              clusterPositions[clusterTagName].reduce(
                (acc, p) => acc + p.x,
                0
              ) / clusterPositions[clusterTagName].length,
            y:
              clusterPositions[clusterTagName].reduce(
                (acc, p) => acc + p.y,
                0
              ) / clusterPositions[clusterTagName].length,
          };
          const clusterLabel = document.getElementById(
            clusters[clusterTagName].clusterLabel
          );

          // update position from the viewport
          const viewportPos = sigma.graphToViewport(clusterPos as Coordinates);

          // adapt the position to viewport coordinates
          clusterLabelsDoms += `<div id='${cluster.clusterLabel}' class="clusterLabel absolute" style="top:${viewportPos.y}px;left:${viewportPos.x}px;color:${cluster.color}">${cluster.clusterLabel}</div>`;
          if (clusterLabel) {
            clusterLabel.style.top = `${viewportPos.y}px`;
            clusterLabel.style.left = `${viewportPos.x}px`;
          }
        });

        clustersLayer.innerHTML = clusterLabelsDoms;
      });
    }
  };

  useEffect(() => {
    if (graph && isEmpty(clusterPositions)) {
      const newClusterPositions: ClusterPositionsData = {};
      graph.forEachNode((node, atts) => {
        // store cluster's nodes positions to calculate cluster label position
        if (newClusterPositions[atts.cluster]?.length) {
          newClusterPositions[atts.cluster].push({ x: atts.x, y: atts.y });
        } else {
          newClusterPositions[atts.cluster] = [{ x: atts.x, y: atts.y }];
        }
      });
      setClusterPositions(newClusterPositions);
    }

    if (sigma && graph && firstInitFlag) {
      setFirstInitFlag(false);
      sigma?.setGraph(graph);
      initClusters();
      initEventListeners();
    }
  }, [graph]);

  return (
    <>
      <SigmaContainer
        className="relative"
        ref={setSigma}
        settings={{
          nodeProgramClasses: { image: getNodeProgramImage() },
          defaultNodeType: "image",
          defaultEdgeType: "arrow",
          labelDensity: 0.07,
          labelGridCellSize: 60,
          labelRenderedSizeThreshold: 15,
          labelFont: "Lato, sans-serif",
          zIndex: true,
        }}
      >
        <ControlsContainer position={"bottom-right"}>
          <ZoomControl />
          <hr />
          <FullScreenControl />
          <hr />
          <LayoutForceAtlas2Control />
        </ControlsContainer>
        <ControlsContainer position={"top-right"}>
          <SearchControl className="w-[200px]" />
        </ControlsContainer>
      </SigmaContainer>
      <div
        ref={contextMenuRef}
        className="hidden absolute p-2 bg-black color-white rounded-lg"
      >
        {contextMenuContent}
      </div>
    </>
  );
};

export default GraphContainer;
